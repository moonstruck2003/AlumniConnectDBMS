<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminAuthController extends Controller
{
    /**
     * Handle admin login.
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $adminUsername = config('services.admin.username');
        $adminPassword = config('services.admin.password');

        if ($request->username === $adminUsername && $request->password === $adminPassword) {
            // Using the password as a simple token for simplicity (Base64 encoded)
            $token = base64_encode($adminUsername . ':' . $adminPassword);
            
            return response()->json([
                'message' => 'Admin login successful',
                'admin_token' => $token,
                'user' => [
                    'name' => 'System Admin',
                    'role' => 'admin'
                ]
            ], 200);
        }

        return response()->json([
            'message' => 'Invalid admin credentials.'
        ], 401);
    }
}
