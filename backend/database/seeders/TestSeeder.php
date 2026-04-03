<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TestSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Insert Student User
        $studentUserId = DB::table('users')->insertGetId([
            'email' => 'student@test.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'created_at' => now(),
            'updated_at' => now(),
        ], 'user_id');

        // 2. Insert User Profile
        DB::table('user_profiles')->insert([
            'user_id' => $studentUserId,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'bio' => 'Computer Science student at DU.',
            'linkedin_url' => 'https://linkedin.com/in/johndoe',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Insert Student Record
        $studentId = DB::table('students')->insertGetId([
            'user_id' => $studentUserId,
            'department' => 'CSE',
            'cgpa' => 3.90,
            'created_at' => now(),
            'updated_at' => now(),
        ], 'student_id');

        // 4. Insert Recruiter User
        $recruiterUserId = DB::table('users')->insertGetId([
            'email' => 'hr@google.com',
            'password' => Hash::make('password'),
            'role' => 'recruiter',
            'created_at' => now(),
            'updated_at' => now(),
        ], 'user_id');

        // 5. Insert Recruiter Profile
        DB::table('user_profiles')->insert([
            'user_id' => $recruiterUserId,
            'first_name' => 'Jane',
            'last_name' => 'HR',
            'bio' => 'Hiring for Google.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 6. Insert Recruiter Record
        $recruiterId = DB::table('recruiters')->insertGetId([
            'user_id' => $recruiterUserId,
            'company_name' => 'Google',
            'created_at' => now(),
            'updated_at' => now(),
        ], 'recruiter_id');

        // 7. Insert Job Category
        $categoryId = DB::table('job_categories')->insertGetId([
            'category_name' => 'Engineering',
            'created_at' => now(),
            'updated_at' => now(),
        ], 'category_id');

        // 8. Insert Job Listing
        $jobId = DB::table('job_listing')->insertGetId([
            'recruiter_id' => $recruiterId,
            'category_id' => $categoryId,
            'job_title' => 'Software Engineer Intern',
            'job_description' => 'Work on Google Search engine.',
            'created_at' => now(),
            'updated_at' => now(),
        ], 'job_id');

        // 9. Insert Job Application
        DB::table('job_applications')->insert([
            'job_id' => $jobId,
            'student_id' => $studentId,
            'status' => 'Pending',
            'applied_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
