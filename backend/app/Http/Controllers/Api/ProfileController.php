<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\UserProfile;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    /**
     * Fetch the authenticated user along with their profile and role-specific data.
     */
    public function show(Request $request)
    {
        // Load the main profile
        $user = $request->user()->load(['profile']);

        // Load specific role relationship based on user's role
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

    /**
     * Update the authenticated user's profile details across multiple tables.
     */
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
                $user->alumni->update($request->only(['company', 'job_title']));
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

    /**
     * Delete the authenticated user account and all relating data.
     */
    public function destroy(Request $request)
    {
        $user = $request->user();

        try {
            DB::beginTransaction();

            // Roles are usually tied to user_id, so they'll be cleaned up if foreign keys cascade
            // But we can do it manually to be safe if cascades aren't defined
            if ($user->student) $user->student->delete();
            if ($user->alumni) $user->alumni->delete();
            if ($user->recruiter) $user->recruiter->delete();
            if ($user->profile) $user->profile->delete();

            // Final User teardown
            $user->delete();

            DB::commit();

            return response()->json(['message' => 'Account deleted successfully'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Deletion failed'], 500);
        }
    }
}
