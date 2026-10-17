<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\TicketsController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);


//Locations Api
Route::get('/locations', [LocationController::class, 'index']);
Route::post('/locations', [LocationController::class, 'store']);
Route::get('/locations/qr/{qrCode}', [LocationController::class, 'showByQr']);
Route::delete('/locations/{id}', [LocationController::class, 'destroy']);

//Tickets Api
Route::get('/tickets', [TicketsController::class, 'index']);
Route::post('/tickets', [TicketsController::class, 'store']);
Route::get('/tickets/{id}', [TicketsController::class, 'show']);
Route::put('/tickets/{id}', [TicketsController::class, 'update']);
Route::delete('/tickets/{id}', [TicketsController::class, 'destroy']);

Route::get('/users', function () {
    return User::all(['id', 'name', 'email', 'school_id', 'username', 'role']);
});

