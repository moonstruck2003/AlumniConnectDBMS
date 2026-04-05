<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\EventController;

// Public routes
Route::post('/signup', [UserController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (require Sanctum token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Profile Management
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);

    // Job Board
    Route::get('/jobs', [JobController::class, 'index']);
    Route::get('/jobs/categories', [JobController::class, 'getCategories']);
    Route::post('/jobs', [JobController::class, 'store']);
    Route::get('/jobs/my-jobs', [JobController::class, 'myJobs']);
    Route::get('/jobs/{id}', [JobController::class, 'show']);
    Route::post('/jobs/{id}/toggle', [JobController::class, 'toggleStatus']);
    Route::delete('/jobs/{id}', [JobController::class, 'destroy']);

    // Events API
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
});
