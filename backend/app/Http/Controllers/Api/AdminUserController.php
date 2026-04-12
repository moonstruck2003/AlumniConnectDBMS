<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    /**
     * List all users by categories.
     */
    public function listUsers(Request $request)
    {
        $users = User::with(['profile', 'student', 'alumni', 'recruiter'])
            ->get()
            ->groupBy('role');

        return response()->json([
            'users' => $users,
        ], 200);
    }

    /**
     * Set a user's verification status.
     * Use query param 'status' or just toggle.
     * Let's make it a toggle for simplicity.
     */
    public function toggleVerification(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->is_verified = !$user->is_verified;
        $user->save();

        $action = $user->is_verified ? 'verified' : 'revoked verification for';

        if ($user->is_verified) {
            Notification::create([
                'user_id' => $user->user_id,
                'sender_id' => auth()->id(),
                'type' => 'system',
                'title' => 'Verification Success ✅',
                'message' => 'Congratulations! Your account has been verified by the administration.',
                'link' => '/profile',
            ]);
        }

        return response()->json([
            'message' => "Successfully {$action} user",
            'user' => $user->load(['profile', 'student', 'alumni', 'recruiter']),
        ], 200);
    }
}
