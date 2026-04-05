<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\Student;
use App\Models\Alumni;
use App\Models\Recruiter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:student,alumni,recruiter',
            'bio' => 'nullable|string',
            'linkedin_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $user = User::create([
                'email' => $request->email,
                'password' => $request->password,
                'role' => $request->role,
            ]);

            UserProfile::create([
                'user_id' => $user->user_id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'bio' => $request->bio,
                'linkedin_url' => $request->linkedin_url,
            ]);

            if ($request->role === 'student') {
                Student::create([
                    'user_id' => $user->user_id,
                    // Note: 'student_id' is an auto-increment column in your DB, 
                    // so we aren't explicitly inserting a string '2024-1-60-XXX' directly here.
                    'department' => $request->department,
                    'cgpa' => $request->cgpa,
                ]);
            } elseif ($request->role === 'alumni') {
                Alumni::create([
                    'user_id' => $user->user_id,
                    'company' => $request->company,
                    'job_title' => $request->job_title,
                    'is_accepting_mentee' => true,
                ]);
            } elseif ($request->role === 'recruiter') {
                Recruiter::create([
                    'user_id' => $user->user_id,
                    'company_name' => $request->company_name,
                ]);
            }

            DB::commit();

            $user->refresh();
            $user->load(['profile', 'recruiter', 'student', 'alumni']);

            $token = auth('api')->login($user);

            return response()->json([
                'message' => 'Account created successfully!',
                'user' => $user,
                'token' => $token,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create user', 'error' => $e->getMessage()], 500);
        }
    }
}