<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\MentorshipRequest;
use Illuminate\Http\Request;

class AlumniController extends Controller
{
    /**
     * Display a listing of all alumni.
     */
    /**
     * Display a listing of all alumni.
     */
    public function index()
    {
        $alumni = User::where('role', 'alumni')
            ->with(['profile', 'alumni'])
            ->get();

        $currentUserId = auth('api')->id();
        $acceptedAlumniIds = [];
        if ($currentUserId) {
             $acceptedAlumniIds = MentorshipRequest::where('status', 'Accepted')
                ->whereHas('student', function($q) use ($currentUserId) {
                    $q->where('user_id', $currentUserId);
                })
                ->whereHas('listing', function($q) {
                    $q->whereNotNull('alumni_id');
                })
                ->get()
                ->pluck('listing.alumni_id')
                ->toArray();
        }

        $alumniWithConnection = $alumni->map(function($user) use ($acceptedAlumniIds) {
            $user->can_message = in_array($user->alumni?->alumni_id, $acceptedAlumniIds);
            return $user;
        });

        return response()->json([
            'alumni' => $alumniWithConnection
        ], 200);
    }

    /**
     * Display the specified alumni profile.
     */
    public function show($id)
    {
        $alumnus = User::where('role', 'alumni')
            ->where('user_id', $id)
            ->with(['profile', 'alumni'])
            ->first();

        if (!$alumnus) {
            return response()->json([
                'message' => 'Alumni not found.'
            ], 404);
        }

        return response()->json([
            'alumnus' => $alumnus
        ], 200);
    }
}
