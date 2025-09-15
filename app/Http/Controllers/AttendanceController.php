<?php

namespace App\Http\Controllers;

use App\Models\AbsentReason;
use App\Models\Attendance;
use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use App\Models\AttendanceUserPosition;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd(Attendance::with('users', 'events', 'absent_reasons')->get()->toArray());
        $this->pass('index attendance');

        return Inertia::render('attendance/index', [
            'attendances' => Attendance::with('users', 'event', 'absent_reason')->get(),
            'users' => User::get(),
            'events' => Event::get(),
            'absent' => AbsentReason::get(),
            'permissions' => [
                'canAdd' => $this->user->can('create attendance'),
                'canShow' => $this->user->can('show attendance'),
                'canUpdate' => $this->user->can('update attendance'),
                'canDelete' => $this->user->can('delete attendance'),
            ]
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
        $this->pass('create attendance');

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
        $this->pass('show attendance');

            $attendance->load([
            'event',
            'absent_reason',
            'users.positions', // daftar semua posisi yang dimiliki user
            'users.attendancePositions' => function ($q) use ($attendance) {
                // ambil hanya posisi dari absensi ini
                $q->where('attendance_id', $attendance->id);
            },
        ]);

        // pastikan attendancePositions selalu array (bukan collection kosong/null)
        $attendance->users->each(function ($user) {
            $user->attendancePositions = $user->attendancePositions->map(function ($pivot) {
                return [
                    'position_id' => $pivot->pivot->position_id,
                ];
            })->values(); // selalu array []
        });

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
        $this->pass('update attendance');

        $validated = $request->validated();

        $attendance->update([
            'events_id'         => $validated['events_id'],
            'status'            => $validated['status'],
            'absent_reasons_id' => $validated['absent_reasons_id'] ?? null,
        ]);

        $attendance->users()->sync($validated['users_id']);

        return redirect()->route('attendance.index')->with('success', 'Attendance berhasil diperbarui');
    }

    public function updatePositionsAll(Request $request, Attendance $attendance)
    {
            $data = $request->validate([
            'positions' => 'required|array',
            'positions.*' => 'array',
            'positions.*.*' => 'exists:positions,id',
        ]);

        foreach ($data['positions'] as $userId => $posIds) {
            AttendanceUserPosition::where('attendance_id', $attendance->id)
                ->where('user_id', $userId)
                ->delete();

            if (!empty($posIds)) {
                $insertData = array_map(fn($posId) => [
                    'attendance_id' => $attendance->id,
                    'user_id' => $userId,
                    'position_id' => $posId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ], $posIds);

                AttendanceUserPosition::insert($insertData);
            }
        }

        $attendance->load([
            'event',
            'absent_reason',
            'users' => function ($q) use ($attendance) {
                $q->with([
                    'positions',
                    'attendancePositions' => function ($q2) use ($attendance) {
                        $q2->where('attendance_id', $attendance->id);
                    },
                ]);
            },
        ]);

        return inertia('attendance/show', [
            'attendance' => $attendance,
        ])->with('success', 'Absensi berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        $this->pass('delete attendance');
        
        $attendance->delete();
    }
}
