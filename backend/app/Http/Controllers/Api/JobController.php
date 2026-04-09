<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\JobCategory;
use App\Models\Recruiter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobController extends Controller
{
    /**
     * Get all job listings with optional filtering.
     */
    public function index(Request $request)
    {
        // Optimized query: select only summary fields, skip heavy description for list view
        $query = JobListing::select([
            'job_id', 'recruiter_id', 'category_id', 'job_title', 
            'company_name', 'job_type', 'location', 'salary', 
            'deadline', 'is_active', 'created_at'
        ])->with([
            'category:category_id,category_name', 
            'recruiter:recruiter_id,company_name'
        ]);

        // Filtering by job type (Job or Internship)
        if ($request->has('job_type') && $request->job_type !== 'all') {
            $query->where('job_type', $request->job_type);
        }

        // Filtering by category
        if ($request->has('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        // Search by title or company
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('job_title', 'LIKE', "%{$search}%")
                  ->orWhere('company_name', 'LIKE', "%{$search}%");
            });
        }

        // Only show active jobs for students/alumni
        // Recruiters can see all their jobs (we might handle this in a separate method later)
        $query->where('is_active', true);

        $jobs = $query->orderBy('created_at', 'desc')->get();

        return response()->json($jobs);
    }

    /**
     * Store a new job listing (Recruiter only).
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Check if user is a recruiter
        $recruiter = Recruiter::where('user_id', $user->user_id)->first();
        if (!$recruiter) {
            return response()->json(['message' => 'Recruiter profile not found. Please ensure your account is set up as a recruiter.'], 403);
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:job_categories,category_id',
            'job_title' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'job_type' => 'required|in:Job,Internship',
            'location' => 'nullable|string|max:255',
            'salary' => 'nullable|string',
            'deadline' => 'nullable|date',
            'contact_email' => 'required|email',
            'job_description' => 'nullable|string',
        ]);

        // Handle empty deadline string from frontend
        if (isset($validated['deadline']) && empty($validated['deadline'])) {
            $validated['deadline'] = null;
        }

        $job = JobListing::create([
            'recruiter_id' => $recruiter->recruiter_id,
            'category_id' => $validated['category_id'],
            'job_title' => $validated['job_title'],
            'company_name' => $validated['company_name'] ?? $recruiter->company_name,
            'job_type' => $validated['job_type'],
            'location' => $validated['location'],
            'salary' => $validated['salary'],
            'deadline' => $validated['deadline'],
            'contact_email' => $validated['contact_email'],
            'job_description' => $validated['job_description'],
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Job posted successfully',
            'job' => $job
        ], 201);
    }

    /**
     * Toggle job status (Recruiter only).
     */
    public function toggleStatus(Request $request, $id)
    {
        $user = Auth::user();
        $job = JobListing::findOrFail($id);

        // Check if the authenticated user is the owner of the job
        $recruiter = Recruiter::where('user_id', $user->user_id)->first();
        
        if (!$recruiter || (int)$job->recruiter_id !== (int)$recruiter->recruiter_id) {
            return response()->json(['message' => 'Unauthorized Action'], 403);
        }

        $job->is_active = !$job->is_active;
        $job->save();

        return response()->json([
            'message' => 'Job status updated',
            'is_active' => $job->is_active
        ]);
    }

    /**
     * Get all job categories.
     */
    public function getCategories()
    {
        return response()->json(JobCategory::all());
    }

    /**
     * Get jobs for the logged in recruiter.
     */
    public function myJobs()
    {
        $user = Auth::user();
        $recruiter = Recruiter::where('user_id', $user->user_id)->first();
        
        if (!$recruiter) {
            return response()->json(['message' => 'Recruiter profile not found. Please re-login.'], 404);
        }

        $jobs = JobListing::with('category')
            ->where('recruiter_id', $recruiter->recruiter_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($jobs);
    }

    /**
     * Delete job listing permanently (Recruiter only).
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $recruiter = Recruiter::where('user_id', $user->user_id)->first();
        
        $job = JobListing::findOrFail($id);

        if (!$recruiter || (int)$job->recruiter_id !== (int)$recruiter->recruiter_id) {
            return response()->json(['message' => 'Unauthorized Action'], 403);
        }

        $job->delete();

        return response()->json([
            'message' => 'Job listing permanently deleted'
        ], 200);
    }
    /**
     * Get a single job listing.
     */
    public function show($id)
    {
        $job = JobListing::with(['category', 'recruiter'])->findOrFail($id);
        return response()->json($job);
    }
}
