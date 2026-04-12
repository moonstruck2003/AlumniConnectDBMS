<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\Event;
use App\Models\MentorshipListing;
use Illuminate\Http\Request;

class AdminContentController extends Controller
{
    /**
     * List all jobs.
     */
    public function listJobs()
    {
        $jobs = JobListing::with(['recruiter.user.profile'])->get();
        return response()->json(['jobs' => $jobs]);
    }

    /**
     * Delete a job.
     */
    public function deleteJob($id)
    {
        $job = JobListing::findOrFail($id);
        $job->delete();
        return response()->json(['message' => 'Job listing removed successfully']);
    }

    /**
     * List all events.
     */
    public function listEvents()
    {
        $events = Event::all();
        return response()->json(['events' => $events]);
    }

    /**
     * Delete an event.
     */
    public function deleteEvent($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();
        return response()->json(['message' => 'Event removed successfully']);
    }

    /**
     * List all mentorship listings.
     */
    public function listMentorships()
    {
        $mentorships = MentorshipListing::with(['alumni.user.profile'])->get();
        return response()->json(['mentorships' => $mentorships]);
    }

    /**
     * Delete a mentorship listing.
     */
    public function deleteMentorship($id)
    {
        $mentorship = MentorshipListing::findOrFail($id);
        $mentorship->delete();
        return response()->json(['message' => 'Mentorship listing removed successfully']);
    }
}
