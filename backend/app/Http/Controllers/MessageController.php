<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Models\MentorshipRequest;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * Check if two users are allowed to communicate.
     */
    private function canCommunicate($userId1, $userId2)
    {
        // One of them is a student and the other is an alumni
        // We need to check if there's an 'Accepted' mentorship request between them.
        
        $user1 = User::find($userId1);
        $user2 = User::find($userId2);

        if (!$user1 || !$user2) return false;

        // Simplified check: Is there an accepted mentorship request?
        $count = MentorshipRequest::where('status', 'Accepted')
            ->where(function ($query) use ($user1, $user2) {
                $query->where(function ($q) use ($user1, $user2) {
                    // User1 is student, User2 is mentor
                    $q->whereHas('student', function ($sq) use ($user1) {
                        $sq->where('user_id', $user1->user_id);
                    })->whereHas('listing.alumni', function ($aq) use ($user2) {
                        $aq->where('user_id', $user2->user_id);
                    });
                })->orWhere(function ($q) use ($user1, $user2) {
                    // User2 is student, User1 is mentor
                    $q->whereHas('student', function ($sq) use ($user2) {
                        $sq->where('user_id', $user2->user_id);
                    })->whereHas('listing.alumni', function ($aq) use ($user1) {
                        $aq->where('user_id', $user1->user_id);
                    });
                });
            })->count();

        return $count > 0;
    }

    public function getConversation($userId)
    {
        $currentUserId = auth()->id();

        if (!$this->canCommunicate($currentUserId, $userId)) {
            // Check if there ARE actual messages already (historical context)
            // If they already have messages, maybe they should still see it?
            // But the prompt says "only then they will be able to chat".
            // I'll allow viewing historical if messages exist, but sendMessage will be blocked.
            $exists = Message::where(function ($query) use ($currentUserId, $userId) {
                $query->where('sender_id', $currentUserId)->where('receiver_id', $userId);
            })->orWhere(function ($query) use ($currentUserId, $userId) {
                $query->where('sender_id', $userId)->where('receiver_id', $currentUserId);
            })->exists();

            if (!$exists) {
                return response()->json(['message' => 'Unauthorized: Mentorship connection required.'], 403);
            }
        }

        $messages = Message::query()->where(function ($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $currentUserId)
                  ->where('receiver_id', $userId);
        })->orWhere(function ($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', $currentUserId);
        })->orderBy('created_at', 'asc')->get();

        Message::query()->where('sender_id', $userId)
            ->where('receiver_id', $currentUserId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json($messages);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,user_id',
            'content' => 'required|string',
        ]);

        if (!$this->canCommunicate(auth()->id(), $request->receiver_id)) {
            return response()->json(['message' => 'Unauthorized: Mentorship connection required to send messages.'], 403);
        }

        $message = Message::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $request->receiver_id,
            'content' => $request->content,
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $request->receiver_id,
            'sender_id' => auth()->id(),
            'type' => 'message',
            'title' => 'New Message',
            'message' => auth()->user()->name . ' sent you a message.',
            'link' => '/messages',
        ]);

        return response()->json($message, 201);
    }

    public function getConversations()
    {
        $currentUserId = auth()->id();

        // Get users who have messages with the current user OR have an accepted mentorship request
        $sentIds = Message::query()->where('sender_id', $currentUserId)->pluck('receiver_id')->toArray();
        $receivedIds = Message::query()->where('receiver_id', $currentUserId)->pluck('sender_id')->toArray();
        
        // Also include accepted mentor/students who haven't messaged yet
        $mentees = MentorshipRequest::where('status', 'Accepted')
            ->whereHas('listing.alumni', function($q) use ($currentUserId) {
                $q->where('user_id', $currentUserId);
            })->with('student')->get()->pluck('student.user_id')->toArray();
            
        $mentors = MentorshipRequest::where('status', 'Accepted')
            ->whereHas('student', function($q) use ($currentUserId) {
                $q->where('user_id', $currentUserId);
            })->with('listing.alumni')->get()->pluck('listing.alumni.user_id')->toArray();

        $userIds = collect(array_merge($sentIds, $receivedIds, $mentees, $mentors))->unique();

        $users = User::query()
            ->with('profile')
            ->whereIn('user_id', $userIds)
            ->get();

        return response()->json($users);
    }
}
