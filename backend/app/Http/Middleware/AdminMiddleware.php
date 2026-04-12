<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('X-Admin-Token');
        
        $adminUsername = config('services.admin.username');
        $adminPassword = config('services.admin.password');
        $expectedToken = base64_encode($adminUsername . ':' . $adminPassword);

        if ($token && $token === $expectedToken) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Unauthorized admin access.'
        ], 403);
    }
}
