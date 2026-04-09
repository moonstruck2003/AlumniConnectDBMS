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
    /**
     * Display a listing of all alumni.
     */
    public function index()
    {
        $alumni = User::where('role', 'alumni')
            ->with(['profile', 'alumni'])
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
