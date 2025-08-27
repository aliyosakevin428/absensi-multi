<?php

namespace App\Http\Controllers;

use App\Models\AbsentReason;
use App\Models\Attendance;
use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use App\Models\Event;
use App\Models\User;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd(Attendance::with('users', 'events', 'absent_reasons')->get()->toArray());
        return Inertia::render('attendance/index', [
            'attendances' => Attendance::with('users', 'event', 'absent_reason')->get(),
            'users' => User::get(),
            'events' => Event::get(),
            'absent' => AbsentReason::get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceRequest $request)
    {
        $validated = $request->validated();

        $attendance = Attendance::create([
            'events_id'         => $validated['events_id'],
            'status'            => $validated['status'],
            'absent_reasons_id' => $validated['absent_reasons_id'] ?? null,
        ]);

        $attendance->users()->sync($validated['users_id']);

        return redirect()->route('attendance.index')->with('success', 'Attendance berhasil dibuat');
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance)
    {
        $attendance->load(['users', 'event', 'absent_reason']);

        return Inertia::render('attendance/show', [
            'attendance' => $attendance,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attendance $attendance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceRequest $request, Attendance $attendance)
    {
        $validated = $request->validated();

        $attendance->update([
            'events_id'         => $validated['events_id'],
            'status'            => $validated['status'],
            'absent_reasons_id' => $validated['absent_reasons_id'] ?? null,
        ]);

        $attendance->users()->sync($validated['users_id']);

        return redirect()->route('attendance.index')->with('success', 'Attendance berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
    }
}
