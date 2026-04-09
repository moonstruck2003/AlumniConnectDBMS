<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MentorshipListing;
use App\Models\MentorshipRequest;
use App\Models\Alumni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MentorshipController extends Controller
{
    /**
     * Display a listing of mentorship opportunities from alumni who are accepting mentees.
     */
    public function index()
    {
        // Fetch all alumni who are accepting mentees, with specific column selection
        $alumni = Alumni::where('is_accepting_mentee', true)
            ->select(['alumni_id', 'user_id', 'job_title', 'company'])
            ->with([
                'user:user_id,email', 
                'user.profile:user_id,first_name,last_name,bio'
            ])
            ->latest()
            ->get();

        // Map to a consistent "Mentor" object that the frontend expects
        $mentors = $alumni->map(function($alumnus) {
            return [
                'listing_id' => $alumnus->alumni_id, // Map alumni_id to listing_id for frontend compatibility
                'alumni_id' => $alumnus->alumni_id,
                'description' => $alumnus->user->profile->bio ?? "Hi! I'm an alumni willing to mentor students. Feel free to connect!",
                'alumni' => $alumnus
            ];
        });

        return response()->json($mentors);
    }

    /**
     * Student submits a request for mentorship.
     */
    public function storeRequest(Request $request, $alumniId)
    {
        $user = $request->user();

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Only students can request mentorship.'], 403);
        }

        $request->validate([
            'message' => 'nullable|string|max:1000',
        ]);

        // Find or create a default listing for this alumni so the request table remains consistent
        $listing = MentorshipListing::firstOrCreate(
            ['alumni_id' => $alumniId],
            ['description' => 'Default Mentorship Listing', 'min_coin_bid' => 0]
        );

        // Check if already requested
        $existing = MentorshipRequest::where('listing_id', $listing->listing_id)
            ->where('student_id', $user->student->student_id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already requested mentorship from this mentor.'], 400);
        }

        $mentorshipRequest = MentorshipRequest::create([
            'listing_id' => $listing->listing_id,
            'student_id' => $user->student->student_id,
            'message' => $request->message,
            'status' => 'Pending',
        ]);

        return response()->json([
            'message' => 'Mentorship request submitted successfully.',
            'request' => $mentorshipRequest
        ], 201);
    }

    /**
     * Alumni views requests for their listings.
     */
    public function myIncomingRequests(Request $request)
    {
        $user = $request->user()->load('alumni');

        if (!$user->alumni) {
            return response()->json(['message' => 'Alumni profile not found.'], 404);
        }

        $requests = MentorshipRequest::with(['student.user.profile', 'listing'])
            ->whereHas('listing', function($query) use ($user) {
                $query->where('alumni_id', $user->alumni->alumni_id);
            })
            ->latest()
            ->get();

        return response()->json($requests);
    }

    /**
     * Student views their sent requests.
     */
    public function mySentRequests(Request $request)
    {
        $user = $request->user()->load('student');

        if (!$user->student) {
            return response()->json(['message' => 'Student profile not found.'], 404);
        }

        $requests = MentorshipRequest::with(['listing.alumni.user.profile'])
            ->where('student_id', $user->student->student_id)
            ->latest()
            ->get();

        return response()->json($requests);
    }

    /**
     * Alumni accepts or rejects a request.
     */
    public function updateRequestStatus(Request $request, $requestId)
    {
        $user = $request->user()->load('alumni');

        if (!$user->alumni) {
            return response()->json(['message' => 'Unauthorized: Only alumni can update status.'], 403);
        }

        $request->validate([
            'status' => 'required|in:Accepted,Rejected',
        ]);

        $mentorshipRequest = MentorshipRequest::with('listing')->findOrFail($requestId);

        // Ensure this listing belongs to the authenticated alumni
        if ((int)$mentorshipRequest->listing->alumni_id !== (int)$user->alumni->alumni_id) {
            return response()->json([
                'message' => 'Unauthorized: This request does not belong to you.',
                'listing_alumni' => $mentorshipRequest->listing->alumni_id,
                'logged_alumni' => $user->alumni->alumni_id
            ], 403);
        }

        $mentorshipRequest->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => "Request marked as {$request->status}.",
            'request' => $mentorshipRequest
        ]);
    }
}
