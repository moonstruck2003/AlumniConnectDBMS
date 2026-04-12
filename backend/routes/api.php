<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\MentorshipController;
use App\Http\Controllers\Api\AlumniController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\Api\DashboardController;

use App\Http\Controllers\Api\PasswordResetController;

// Public routes
Route::post('/signup', [UserController::class, 'store']);
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
Route::get('/alumni', [AlumniController::class, 'index']);
Route::get('/alumni/{id}', [AlumniController::class, 'show'])->whereNumber('id');

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
    Route::post('/jobs/{id}/apply', [JobController::class, 'apply'])->whereNumber('id');
    Route::get('/jobs/{id}/applicants', [JobController::class, 'getApplicants'])->whereNumber('id');
    Route::post('/job-applications/{id}/status', [JobController::class, 'updateApplicationStatus'])->whereNumber('id');

    // Event Routes
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);

    // Mentorship Routes
    Route::get('/mentorships', [MentorshipController::class, 'index']);
    Route::post('/mentorships/{listingId}/request', [MentorshipController::class, 'storeRequest'])->whereNumber('listingId');
    Route::get('/mentorships/sent', [MentorshipController::class, 'mySentRequests']);
    Route::get('/mentorships/incoming', [MentorshipController::class, 'myIncomingRequests']);
    Route::post('/mentorship-requests/{requestId}/status', [MentorshipController::class, 'updateRequestStatus'])->whereNumber('requestId');

    // Messaging Routes
    Route::get('/messages/conversations', [MessageController::class, 'getConversations']);
    Route::get('/messages/{userId}', [MessageController::class, 'getConversation']);
    Route::post('/messages', [MessageController::class, 'sendMessage']);

    // Dashboard Routes
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('/dashboard/activities', [DashboardController::class, 'getActivities']);
});
