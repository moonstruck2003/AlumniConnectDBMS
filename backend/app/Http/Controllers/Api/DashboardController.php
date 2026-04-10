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
        // For now returning empty array as requested to show "domain is silent" if no data
        // but can be hooked to logs or recent table entries.
        return response()->json([]);
    }
}
