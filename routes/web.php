<?php

use App\Http\Controllers\AbsentReasonController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventTypeController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('user', UserController::class);
    // Route::post('user', [UserController::class, 'store'])->name('user.store');
    Route::resource('team', TeamController::class);
    Route::resource('position', PositionController::class);
    Route::resource('absent-reason', AbsentReasonController::class);
    Route::resource('event-type', EventTypeController::class);
    Route::resource('event', EventController::class);
    Route::resource('attendance', AttendanceController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
