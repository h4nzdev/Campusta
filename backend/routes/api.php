<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Authenticated API Routes (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Session & User Info
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    // General Lookup endpoints
    Route::get('/locations', [LocationController::class, 'index']);
    Route::get('/locations/qr/{qrCode}', [LocationController::class, 'showByQr']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/read', [NotificationController::class, 'markAsRead']);

    // General Ticket endpoints (Scoping handled automatically by user role)
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);

    /*
    |--------------------------------------------------------------------------
    | Role-Based Routes
    |--------------------------------------------------------------------------
    */
    // Student, Faculty & Admin: Report concerns & verify/reopen resolutions
    Route::middleware('role:student,faculty,admin')->group(function () {
        Route::post('/tickets', [TicketController::class, 'store']);
        Route::put('/tickets/{id}/verify', [TicketController::class, 'verifyResolution']);
    });

    // Maintenance & Admin: Update task status (Start work / Resolve with notes & photo)
    Route::middleware('role:maintenance,admin')->group(function () {
        Route::put('/tickets/{id}/status', [TicketController::class, 'updateStatus']);
    });

    // Administrator only: Master ticket dispatch, analytics, user lists, and location/QR management
    Route::middleware('role:admin')->group(function () {
        Route::put('/tickets/{id}', [TicketController::class, 'update']);
        Route::get('/admin/stats', [TicketController::class, 'stats']);
        Route::get('/admin/users', [AuthController::class, 'users']);
        Route::post('/locations', [LocationController::class, 'store']);
        Route::delete('/locations/{id}', [LocationController::class, 'destroy']);
    });
});
