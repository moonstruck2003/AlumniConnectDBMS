<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\MentorshipController;
use App\Http\Controllers\EventController;

// Public auth
Route::post('/signup', [UserController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);

// Protected (JWT Bearer)
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);

    // Job Routes
    Route::get('/jobs', [JobController::class, 'index']);
    Route::get('/jobs/categories', [JobController::class, 'getCategories']);
    Route::get('/jobs/{id}', [JobController::class, 'show'])->whereNumber('id');
    Route::post('/jobs', [JobController::class, 'store']);
    Route::get('/jobs/my-jobs', [JobController::class, 'myJobs']);
    Route::post('/jobs/{id}/toggle', [JobController::class, 'toggleStatus'])->whereNumber('id');
    Route::delete('/jobs/{id}', [JobController::class, 'destroy'])->whereNumber('id');

    // Event Routes
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);

    // Mentorship Routes
    Route::get('/mentorships', [MentorshipController::class, 'index']);
    Route::post('/mentorships/{listingId}/request', [MentorshipController::class, 'storeRequest'])->whereNumber('listingId');
    Route::get('/mentorships/sent', [MentorshipController::class, 'mySentRequests']);
    Route::get('/mentorships/incoming', [MentorshipController::class, 'myIncomingRequests']);
    Route::post('/mentorship-requests/{requestId}/status', [MentorshipController::class, 'updateRequestStatus'])->whereNumber('requestId');
});
