<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\JobCategory;
use App\Models\Recruiter;
use App\Models\JobApplication;
use App\Models\Student;
use App\Models\Alumni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class JobController extends Controller
{
    /**
     * Get all job listings with optional filtering.
     */
    public function index(Request $request)
    {
        // Optimized query: select only summary fields, skip heavy description for list view
        $query = JobListing::select([
            'job_id',
            'recruiter_id',
            'category_id',
            'job_title',
            'company_name',
            'job_type',
            'location',
            'salary',
            'deadline',
            'is_active',
            'created_at'
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
            $query->where(function ($q) use ($search) {
                $q->where('job_title', 'LIKE', "%{$search}%")
                    ->orWhere('company_name', 'LIKE', "%{$search}%");
            });
        }

        // Only show active jobs for students/alumni
        // Recruiters can see all their jobs (we might handle this in a separate method later)
        $query->where('is_active', true);

        $jobs = $query->orderBy('created_at', 'desc')->get();

        // Check application status for each job
        $user = Auth::user();
        if ($user && ($user->role === 'student' || $user->role === 'alumni')) {
            $student = $user->role === 'student' ? Student::where('user_id', $user->user_id)->first() : null;
            $alumni = $user->role === 'alumni' ? Alumni::where('user_id', $user->user_id)->first() : null;

            if ($student || $alumni) {
                $jobs->each(function ($job) use ($student, $alumni) {
                    $query = JobApplication::where('job_id', $job->job_id);
                    if ($student) {
                        $query->where('student_id', $student->student_id);
                    } else {
                        $query->where('alumni_id', $alumni->alumni_id);
                    }

                    $job->has_applied = $query->exists();
                });
            } else {
                // If user is authenticated as student/alumni but has no profile record yet
                $jobs->each(function ($job) {
                    $job->has_applied = false;
                });
            }
        }

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

        if (!$recruiter || (int) $job->recruiter_id !== (int) $recruiter->recruiter_id) {
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

        if (!$recruiter || (int) $job->recruiter_id !== (int) $recruiter->recruiter_id) {
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

        // Check if current user has already applied
        $user = Auth::user();
        $hasApplied = false;
        if ($user && ($user->role === 'student' || $user->role === 'alumni')) {
            $query = JobApplication::where('job_id', $id);
            if ($user->role === 'student') {
                $student = Student::where('user_id', $user->user_id)->first();
                if ($student)
                    $query->where('student_id', $student->student_id);
            } else {
                $alumni = Alumni::where('user_id', $user->user_id)->first();
                if ($alumni)
                    $query->where('alumni_id', $alumni->alumni_id);
            }
            $hasApplied = $query->exists();
        }

        $job->has_applied = $hasApplied;
        return response()->json($job);
    }

    /**
     * Apply for a job listing.
     */
    public function apply(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user || !in_array($user->role, ['student', 'alumni'])) {
            return response()->json(['message' => 'Only students and alumni can apply for jobs.'], 403);
        }

        $request->validate([
            'cv' => 'required|file|mimes:pdf,doc,docx|max:3072', // 3MB limit
        ]);

        $job = JobListing::findOrFail($id);
        if (!$job->is_active) {
            return response()->json(['message' => 'This job listing is no longer active.'], 400);
        }

        $studentId = null;
        $alumniId = null;

        if ($user->role === 'student') {
            $student = Student::where('user_id', $user->user_id)->first();
            if (!$student)
                return response()->json(['message' => 'Student profile not found.'], 404);
            $studentId = $student->student_id;
        } else {
            $alumni = Alumni::where('user_id', $user->user_id)->first();
            if (!$alumni)
                return response()->json(['message' => 'Alumni profile not found.'], 404);
            $alumniId = $alumni->alumni_id;
        }

        // Check for existing application
        $exists = JobApplication::where('job_id', $id)
            ->where(function ($q) use ($studentId, $alumniId) {
                if ($studentId)
                    $q->where('student_id', $studentId);
                else
                    $q->where('alumni_id', $alumniId);
            })->exists();

        if ($exists) {
            return response()->json(['message' => 'You have already applied for this position.'], 400);
        }

        // Store CV
        $path = $request->file('cv')->store('resumes', 'public');

        $application = JobApplication::create([
            'job_id' => $id,
            'student_id' => $studentId,
            'alumni_id' => $alumniId,
            'cv_path' => $path,
            'status' => 'Pending',
            'applied_at' => now(),
        ]);

        return response()->json([
            'message' => 'Application submitted successfully!',
            'application' => $application
        ], 201);
    }

    /**
     * Get applicants for a job (Recruiter only).
     */
    public function getApplicants($id)
    {
        $user = Auth::user();
        $recruiter = Recruiter::where('user_id', $user->user_id)->first();
        if (!$recruiter)
            return response()->json(['message' => 'Unauthorized'], 403);

        $job = JobListing::where('job_id', $id)
            ->where('recruiter_id', $recruiter->recruiter_id)
            ->firstOrFail();

        $applicants = JobApplication::where('job_id', $id)
            ->with([
                'student.user.profile',
                'alumni.user.profile'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        // Process resumes URLs
        $applicants->map(function ($app) {
            $app->cv_url = $app->cv_path ? asset('storage/' . $app->cv_path) : null;
            return $app;
        });

        return response()->json($applicants);
    }

    /**
     * Update application status.
     */
    public function updateApplicationStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:Pending,Shortlisted,Rejected,Offered'
        ]);

        $application = JobApplication::findOrFail($id);
        $job = JobListing::findOrFail($application->job_id);

        $user = Auth::user();
        $recruiter = Recruiter::where('user_id', $user->user_id)->first();

        if (!$recruiter || (int) $job->recruiter_id !== (int) $recruiter->recruiter_id) {
            return response()->json(['message' => 'Unauthorized Action'], 403);
        }

        $application->status = $request->status;
        $application->save();

        return response()->json([
            'message' => "Application status updated to {$request->status}",
            'status' => $application->status
        ]);
    }
}
