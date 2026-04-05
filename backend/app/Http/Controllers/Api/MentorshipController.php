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
        // Fetch all listings with alumni data, but filtered by alumni who are currently accepting mentees
        $listings = MentorshipListing::with(['alumni.user.profile'])
            ->whereHas('alumni', function($query) {
                $query->where('is_accepting_mentee', true);
            })
            ->latest()
            ->get();

        return response()->json($listings);
    }

    /**
     * Student submits a request for mentorship.
     */
    public function storeRequest(Request $request, $listingId)
    {
        $user = $request->user();

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Only students can request mentorship.'], 403);
        }

        $request->validate([
            'message' => 'nullable|string|max:1000',
        ]);

        $listing = MentorshipListing::findOrFail($listingId);

        // Check if already requested
        $existing = MentorshipRequest::where('listing_id', $listingId)
            ->where('student_id', $user->student->student_id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already requested mentorship for this listing.'], 400);
        }

        $mentorshipRequest = MentorshipRequest::create([
            'listing_id' => $listingId,
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
        $user = $request->user();

        if ($user->role !== 'alumni') {
            return response()->json(['message' => 'Unauthorized'], 403);
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
        $user = $request->user();

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
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
        $user = $request->user();

        if ($user->role !== 'alumni') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:Accepted,Rejected',
        ]);

        $mentorshipRequest = MentorshipRequest::with('listing')->findOrFail($requestId);

        // Ensure this listing belongs to the authenticated alumni
        if ($mentorshipRequest->listing->alumni_id !== $user->alumni->alumni_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
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
