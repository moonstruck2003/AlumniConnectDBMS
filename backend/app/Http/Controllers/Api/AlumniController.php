<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AlumniController extends Controller
{
    /**
     * Display a listing of all alumni.
     */
    public function index()
    {
        // Optimized query: select only required columns to reduce memory/network overhead
        $alumni = User::where('role', 'alumni')
            ->select(['user_id', 'email'])
            ->with([
                'profile:user_id,first_name,last_name,bio,linkedin_url', 
                'alumni:user_id,job_title,company,is_accepting_mentee'
            ])
            ->get();

        return response()->json([
            'alumni' => $alumni
        ], 200);
    }

    /**
     * Display the specified alumni profile.
     */
    public function show($id)
    {
        $alumnus = User::where('role', 'alumni')
            ->where('user_id', $id)
            ->with(['profile', 'alumni'])
            ->first();

        if (!$alumnus) {
            return response()->json([
                'message' => 'Alumni not found.'
            ], 404);
        }

        return response()->json([
            'alumnus' => $alumnus
        ], 200);
    }
}
