<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Handle user login.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid email or password.'
            ], 401);
        }

        $user = auth('api')->user()->load(['profile', 'recruiter', 'student', 'alumni']);

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    /**
     * Handle user logout (revoke token).
     */
    public function logout(Request $request)
    {
        auth('api')->logout();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }

    /**
     * Return the authenticated user (JWT subject).
     */
    public function me(Request $request)
    {
        $user = $request->user()->load(['profile', 'recruiter', 'student', 'alumni']);

        return response()->json([
            'user' => $user,
        ], 200);
    }

    /**
     * Issue a new JWT (requires valid token within refresh TTL).
     */
    public function refresh()
    {
        return response()->json([
            'token' => auth('api')->refresh(),
        ], 200);
    }
}
