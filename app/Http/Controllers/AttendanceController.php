<?php

namespace App\Http\Controllers;

use App\Models\AbsentReason;
use App\Models\Attendance;
use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use App\Models\EventType;
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
            'user' => User::get(),
            'event' => EventType::get(),
            'absent_reason' => AbsentReason::get(),
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
        $data = $request->validate(
            [
                'user_id' => 'required',
                'event_id' => 'required',
                'status' => 'required|string:255',
                'absent_reason_id' => 'required'
            ]
        );

         Attendance::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance)
    {
        //
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
        $data = $request->validate([
            'user_id' => 'required',
            'event_id' => 'required',
            'status' => 'required|string:255',
            'absent_reason_id' => 'required'
        ]);

         $attendance->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
    }
}
