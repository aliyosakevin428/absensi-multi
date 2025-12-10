<?php

use App\Http\Controllers\AbsentReasonController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventTypeController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/about', [WelcomeController::class, 'about'])->name('about');

Route::get('/berita', [WelcomeController::class, 'berita'])->name('berita');
Route::get('/berita/{slug}', [WelcomeController::class, 'baca'])->name('baca');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', UserController::class);
    // Route::put('/users/{user}/details', [UserController::class, 'updateDetails'])->name('users.updateDetails');
    // Route::post('user', [UserController::class, 'store'])->name('user.store');
    Route::resource('team', TeamController::class);

    Route::resource('position', PositionController::class);
    Route::put('/users/{user}/positions-team', [UserController::class, 'updatePositionsAndTeam'])
        ->name('users.updatePositionsAndTeam');

    Route::resource('absent-reason', AbsentReasonController::class);

    Route::resource('event-type', EventTypeController::class);
    Route::apiResource('document', MediaController::class);

    Route::resource('event', EventController::class);
    Route::get('/charts/events-bar', [EventController::class, 'chartBar'])->name('charts.events.bar');

    Route::post('attendances/{attendance}/media', [AttendanceController::class, 'uploadMedia'])->name('attendances.media.upload');
    Route::delete('attendances/{attendance}/media/bulk', [AttendanceController::class, 'destroyMediaBulk'])
        ->name('attendances.media.destroyBulk');
    Route::resource('attendance', AttendanceController::class);
    Route::post('/attendances/{attendance}/positions/all', [AttendanceController::class, 'updatePositionsAll'])
        ->name('attendances.updatePositionsAll');
    Route::post('/attendance/{attendance}/join', [AttendanceController::class, 'joinAttendance'])
        ->name('attendance.join')
        ->middleware('auth');
    Route::delete('/attendance/{attendance}/cancel', [AttendanceController::class, 'cancelAttendance'])
        ->name('attendance.cancel')
        ->middleware('auth');
    Route::post(
    '/attendance/{attendance}/my-position', [AttendanceController::class, 'updateMyPosition'])
        ->name('attendance.updateMyPosition')
        ->middleware('auth');



    Route::post('news/{news}/uploadMedia', [NewsController::class, 'uploadMedia'])->name('news.upload-media');
    Route::put('news/bulk', [NewsController::class, 'bulkUpdate'])->name('news.bulk.update');
    Route::delete('news/bulk', [NewsController::class, 'bulkDelete'])->name('news.bulk.destroy');
    Route::resource('news', NewsController::class);

    Route::resource('role', RoleController::class);
    Route::resource('permission', PermissionController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/roles', [RoleController::class, 'index']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
