<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Alumni;
use App\Models\JobListing;
use App\Models\Event;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get statistics for the dashboard.
     */
    public function getStats()
    {
        try {
            $totalAlumni = User::where('role', 'alumni')->count();
            $activeMentors = Alumni::where('is_accepting_mentee', true)->count();
            $jobPostings = JobListing::count();
            
            // For events, we might want to check the date, but if table is empty just return 0
            $upcomingEvents = Event::where('date', '>=', now()->toDateString())->count();

            return response()->json([
                'stats' => [
                    [
                        'label' => 'Total Alumni',
                        'value' => number_format($totalAlumni),
                        'growth' => '+5.2%', // Mocked growth for now as requested by user aesthetics
                        'icon' => 'Users',
                        'color' => 'text-blue-400'
                    ],
                    [
                        'label' => 'Active Mentors',
                        'value' => number_format($activeMentors),
                        'growth' => '+12.4%',
                        'icon' => 'GraduationCap',
                        'color' => 'text-amber-500'
                    ],
                    [
                        'label' => 'Job Postings',
                        'value' => number_format($jobPostings),
                        'growth' => '+8.1%',
                        'icon' => 'Briefcase',
                        'color' => 'text-emerald-400'
                    ],
                    [
                        'label' => 'Upcoming Events',
                        'value' => number_format($upcomingEvents),
                        'growth' => '+3.5%',
                        'icon' => 'Calendar',
                        'color' => 'text-indigo-400'
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch dashboard stats', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get recent activities for the dashboard.
     */
    public function getActivities()
    {
        try {
            $activities = collect();

            // 1. Get New Jobs
            $jobs = JobListing::latest()->limit(2)->get();
            foreach ($jobs as $job) {
                $activities->push([
                    'id' => 'job-' . $job->job_id,
                    'type' => 'job',
                    'title' => 'New Opportunity',
                    'message' => "{$job->job_title} at {$job->company_name}",
                    'created_at' => $job->created_at,
                    'link' => '/jobs'
                ]);
            }

            // 2. Get New Alumni
            $newAlumni = User::where('role', 'alumni')
                ->with('profile')
                ->latest()
                ->limit(2)
                ->get();
            foreach ($newAlumni as $user) {
                $activities->push([
                    'id' => 'user-' . $user->user_id,
                    'type' => 'user',
                    'title' => 'New Member Joined',
                    'message' => "{$user->name} has joined the legacy.",
                    'created_at' => $user->created_at,
                    'link' => '/alumni'
                ]);
            }

            // 3. Get Upcoming Events
            $events = Event::latest()->limit(2)->get();
            foreach ($events as $event) {
                $activities->push([
                    'id' => 'event-' . $event->id,
                    'type' => 'event',
                    'title' => 'Upcoming Event',
                    'message' => "{$event->title} scheduled for {$event->date}",
                    'created_at' => $event->created_at,
                    'link' => '/events'
                ]);
            }

            // Sort all by latest and take top 5
            return response()->json(
                $activities->sortByDesc('created_at')->values()->take(5)
            );
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch dashboard activities', 'message' => $e->getMessage()], 500);
        }
    }
}
