<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\UserProfile;
use App\Models\MentorshipListing;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load(['profile']);

        if ($user->role === 'student') {
            $user->load('student');
        } elseif ($user->role === 'alumni') {
            $user->load('alumni');
        } elseif ($user->role === 'recruiter') {
            $user->load('recruiter');
        }

        return response()->json([
            'user' => $user
        ], 200);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'first_name' => 'nullable|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'bio' => 'nullable|string',
            'linkedin_url' => 'nullable|url',
            // Student specific
            'cgpa' => 'nullable|numeric|between:0,4.00',
            'department' => 'nullable|string|max:100',
            // Alumni specific
            'company' => 'nullable|string|max:150',
            'job_title' => 'nullable|string|max:150',
            'is_accepting_mentee' => 'nullable|boolean',
            // Recruiter specific
            'company_name' => 'nullable|string|max:150',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            // 1. Update Core Profile
            $profile = UserProfile::firstOrCreate(['user_id' => $user->user_id]);
            $profile->update($request->only(['first_name', 'last_name', 'bio', 'linkedin_url']));

            // 2. Update Role-Specific Table
            if ($user->role === 'student' && $user->student) {
                $user->student->update($request->only(['cgpa', 'department']));
            } elseif ($user->role === 'alumni' && $user->alumni) {
                $user->alumni->update($request->only(['company', 'job_title', 'is_accepting_mentee']));
                
                // Ensure Mentorship Listing exists for directory if accepting mentees
                if ($user->alumni->is_accepting_mentee) {
                    MentorshipListing::firstOrCreate(
                        ['alumni_id' => $user->alumni->alumni_id],
                        [
                            'description' => "Experienced {$user->alumni->job_title} at {$user->alumni->company} looking to guide members.",
                            'min_coin_bid' => 0
                        ]
                    );
                }
            } elseif ($user->role === 'recruiter' && $user->recruiter) {
                $user->recruiter->update($request->only(['company_name']));
            }

            DB::commit();

            return $this->show($request);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Update failed.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        $user = $request->user();

        try {
            DB::beginTransaction();

            if ($user->student) $user->student->delete();
            if ($user->alumni) $user->alumni->delete();
            if ($user->recruiter) $user->recruiter->delete();
            if ($user->profile) $user->profile->delete();

            $user->delete();

            DB::commit();

            return response()->json(['message' => 'Account deleted successfully'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Deletion failed'], 500);
        }
    }
}
