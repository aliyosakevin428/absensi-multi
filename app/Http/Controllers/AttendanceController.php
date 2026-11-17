<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use App\Models\AbsentReason;
use App\Models\Attendance;
use App\Models\AttendanceUserPosition;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // dd(Attendance::with('users', 'events', 'absent_reasons')->get()->toArray());

        $this->pass('index attendance');

        $query = Attendance::query()
            ->with(['users', 'event', 'absent_reason']);


        if ($request->filled('search')) {
            $s = $request->string('search')->toString();

            $query->whereHas('event', function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%");
            });
        }

        if ($request->filled('month')){
            [$year, $month] = explode('-', $request->month);

            $start = Carbon::create((int)$year, (int)$month, 1)->startOfMonth();
            $end = (clone $start)->endOfMonth();

            $query->whereHas('event', function ($q) use ($start, $end) {
                $q->whereBetween('waktu_kegiatan', [$start, $end]);
            });
        }

        $attendances = $query
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('attendance/index', [
            'attendances' => $attendances,
            'users' => User::get(),
            'events' => Event::get(),
            'absent' => AbsentReason::get(),
            'filters' => $request->only(['search', 'month']),
            'permissions' => [
                'canAdd' => $this->user->can('create attendance'),
                'canShow' => $this->user->can('show attendance'),
                'canUpdate' => $this->user->can('update attendance'),
                'canDelete' => $this->user->can('delete attendance'),
            ],
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
            'events_id' => $validated['events_id'],
            'status' => $validated['status'],
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
            'media',
            'event',
            'users.positions',
            'users' => function ($q) {
                $q->withPivot(['absent_reason_id', 'attended_at']);
            },
            'users.attendancePositions' => function ($q) use ($attendance) {
                $q->where('attendance_id', $attendance->id);
            },
        ]);

        $attendance->users->each(function ($user) {
            $user->attendancePositions = $user->attendancePositions
                ->map(function ($pivot) {
                    return [
                        'position_id' => $pivot->pivot->position_id,
                    ];
                })
                ->values();

            $user->my_absent_reason_id = $user->pivot->absent_reason_id ?? null;

            $user->attended_at = $user->pivot->attended_at ?? null;
        });

        return Inertia::render('attendance/show', [
            'attendance' => $attendance,
            'absent' => AbsentReason::select('id', 'name')->get(),
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
            'events_id' => $validated['events_id'],
            'status' => $validated['status'],
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
            'absent_reasons' => 'nullable|array',
        ]);

        foreach ($data['positions'] as $userId => $posIds) {
            AttendanceUserPosition::where('attendance_id', $attendance->id)
                ->where('user_id', $userId)
                ->delete();

            if (! empty($posIds)) {
                $insertData = array_map(fn ($posId) => [
                    'attendance_id' => $attendance->id,
                    'user_id' => $userId,
                    'position_id' => $posId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ], $posIds);

                AttendanceUserPosition::insert($insertData);
            }
        }

        if (!empty($data['absent_reasons'])) {

            $hadirId = AbsentReason::where('name', 'Hadir')->value('id');

            foreach ($data['absent_reasons'] as $userId => $reasonId) {

                $existing = $attendance->users()
                    ->where('users.id', $userId)
                    ->first();

                $attendance->users()->updateExistingPivot($userId, [
                    'absent_reason_id' => $reasonId,
                    'attended_at' => ((int) $reasonId === (int) $hadirId)
                        ? ($existing->pivot->attended_at ?? now())
                        : null,
                ]);
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

    public function updateMyPosition(Request $request, Attendance $attendance)
    {
        $user = auth()->user();

        if (!$user) {
            abort(403, 'Harus login');
        }

        // Validasi tambahan untuk absent reason
        $request->validate([
            'positions' => ['required', 'array'],
            'absent_reason_id' => ['nullable', 'exists:absent_reasons,id'],
        ]);

        $positions = $request->input('positions', []);

        if (!is_array($positions)) {
            abort(422, 'Format data tidak valid');
        }

        $myPositions = $positions[$user->id] ?? null;

        // Cegah user kirim data milik user lain
        foreach ($positions as $userId => $pos) {
            if ((int) $userId !== $user->id) {
                return redirect()->back()->withErrors([
                    'message' => 'Tidak boleh mengubah posisi anggota lain.',
                ]);
            }
        }

        if ($myPositions === null) {
            return redirect()->back()->withErrors([
                'message' => 'Data posisi kamu tidak ditemukan.',
            ]);
        }

        // Pastikan user memang join
        $isJoined = $attendance->users()
            ->where('users.id', $user->id)
            ->exists();

        if (!$isJoined) {
            return redirect()->back()->withErrors([
                'message' => 'Kamu tidak terdaftar di absensi ini.',
            ]);
        }

        AttendanceUserPosition::where('attendance_id', $attendance->id)
            ->where('user_id', $user->id)
            ->delete();

        if (!empty($myPositions)) {
            $insertData = array_map(fn($posId) => [
                'attendance_id' => $attendance->id,
                'user_id' => $user->id,
                'position_id' => $posId,
                'created_at' => now(),
                'updated_at' => now(),
            ], $myPositions);

            AttendanceUserPosition::insert($insertData);
        }

        if ($request->filled('absent_reason_id')) {
            $hadirId = AbsentReason::where('name', 'Hadir')->value('id');

            $existing = $attendance->users()
                ->where('users.id', $user->id)
                ->first();

            $attendance->users()->updateExistingPivot($user->id, [
                'absent_reason_id' => $request->absent_reason_id,
                'attended_at' => ((int) $request->absent_reason_id === (int) $hadirId)
                    ? ($existing->pivot->attended_at ?? now()) // 🔒 kunci waktu pertama
                    : null, // selain Hadir → Belum Absen
            ]);
        }

        return redirect()->back()->with('success', 'Posisi & status kehadiran kamu berhasil disimpan.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        $this->pass('delete attendance');

        $attendance->delete();
    }

    public function uploadMedia(Request $request, Attendance $attendance)
    {
        $this->pass('upload media');

        $request->validate([
            'file' => 'required|file',
        ]);

        $file = $request->file('file');

        $attendance->addMedia($file)->toMediaCollection();

        return redirect()
            ->route('attendance.show', $attendance->id)
            ->with('success', 'Media berhasil diupload');

    }

    public function destroyMediaBulk(Request $request, Attendance $attendance)
    {
        $ids = (array) $request->input('ids', []);

        if (empty($ids)) {
            \Log::warning('Tidak ada ID media dikirim');

            return back()->with('error', 'Tidak ada media yang dipilih');
        }

        $media = Media::where('model_type', Attendance::class)
            ->where('model_id', $attendance->id)
            ->whereIn('id', $ids)
            ->get();

        \Log::info('IDs yang dikirim:', $ids);
        \Log::info('Jumlah media ketemu: '.$media->count());

        foreach ($media as $m) {
            \Log::info("Sebelum hapus media ID={$m->id}, file={$m->file_name}");
            $deleted = $m->delete();
            \Log::info('Setelah delete() → return: '.var_export($deleted, true));
        }

        return redirect()
            ->route('attendance.show', $attendance->id)
            ->with('success', 'Media berhasil dihapus');
    }

    public function joinAttendance(Attendance $attendance)
    {
        $user = auth()->user();

        if (!$user) {
            abort(403, 'Harus login');
        }

        if ($attendance->status === 'Sudah Terlaksana'|| $attendance->status === 'Dibatalkan') {
            return back()->with('error', 'Absensi sudah ditutup');
        }

        // Cek apakah sudah join
        $already = $attendance->users()->where('users.id', $user->id)->exists();

        if ($already) {
            return back()->with('info', 'Kamu sudah terdaftar');
        }

        // Masukkan user ke attendance
        $attendance->users()->attach($user->id);

        return back()->with('success', 'Berhasil mendaftar kehadiran');
    }

    public function cancelAttendance(Attendance $attendance)
    {
        $user = auth()->user();

        if (!$user) {
            abort(403, 'Harus login');
        }

        $exists = $attendance->users()->where('users.id', $user->id)->exists();

        if (! $exists) {
            return back()->with('info', 'Kamu belum terdaftar di absensi ini');
        }

        $attendance->users()->detach($user->id);

        AttendanceUserPosition::where('attendance_id', $attendance->id)
            ->where('user_id', $user->id)
            ->delete();

        return back()->with('success', 'Berhasil membatalkan absensi');
    }

    public function scan(Request $request, string $qr_token)
    {
        $user = auth()->user();

        $event = Event::where('qr_token', $qr_token)
            ->where('is_active', true)
            ->firstOrFail();

        $attendance = Attendance::where('events_id', $event->id)->first();

        if ($attendance && in_array($attendance->status, ['Sudah Terlaksana', 'Dibatalkan'])) {
            return Inertia::render('attendance/scan', [
                'event' => $event,
                'attendance' => $attendance,
                'alreadyJoined' => false,
                'alreadyPresent' => false,
                'attendedAt' => null,
                'closed' => true,
            ]);
        }

        if (! $attendance) {
            $attendance = Attendance::create([
                'events_id' => $event->id,
                'status' => 'Sedang Berlangsung',
            ]);
        }

        $alreadyJoined = $user
            ? $attendance->users()->where('users.id', $user->id)->exists()
            : false;

        $alreadyPresent = false;
        $attendedAt = null;

        if ($user) {
            $u = $attendance->users()->where('users.id', $user->id)->first();
            $alreadyPresent = $u?->pivot?->attended_at !== null;
            $attendedAt = $u?->pivot?->attended_at;
        }

        return Inertia::render('attendance/scan', [
            'event' => $event,
            'attendance' => $attendance,
            'alreadyJoined' => $alreadyJoined,
            'alreadyPresent' => $alreadyPresent,
            'attendedAt' => $attendedAt,
            'closed' => false,
        ]);

    }

    public function joinByEvent(Request $request, Event $event)
    {
        $user = $request->user();
        if (! $user) abort(403, 'Harus login');

        $attendance = Attendance::where('events_id', $event->id)
            ->whereNotIn('status', ['Sudah Terlaksana', 'Dibatalkan'])
            ->firstOrFail();

        $joinedUser = $attendance->users()->whereKey($user->id)->first();

        if ($joinedUser) {
            $alreadyPresent = $joinedUser->pivot?->attended_at !== null;

            return back()->with(
                $alreadyPresent ? 'info' : 'info',
                $alreadyPresent ? 'Kamu sudah hadir (check-in sudah tercatat)' : 'Kamu sudah join daftar hadir. Silahkan check-in (Hadir)',
            );
        }

        $attendance->users()->attach($user->id, [
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Berhasil join daftar hadir. Silahkan check-in (Hadir)');
    }

    public function markPresent(Request $request, Attendance $attendance)
    {
        $user = $request->user();
        if (! $user) abort(403, 'Harus login');

        if (in_array($attendance->status, ['Sudah Terlaksana', 'Dibatalkan'], true)) {
            return back()->with('error', 'Absensi sudah ditutup');
        }

        $pivotRow = $attendance->users()
            ->where('users.id', $user->id)
            ->first()?->pivot;

        if (! $pivotRow) {
            return back()->with('error', 'Kamu belum terdaftar di absensi ini');
        }

        if ($pivotRow->attended_at) {
            return back()->with('info', 'Kamu sudah tercatat hadir');
        }

        $event = $attendance->event;
        if (! $event) {
            return back()->with('error', 'Event tidak ditemukan');
        }

        $hadirId = AbsentReason::where('name', 'Hadir')->value('id');
        if (! $hadirId) abort(500, 'Absent reason "Hadir" belum ada');

        $pivot = [
            'absent_reason_id' => $hadirId,
            'attended_at'      => now(),
        ];

        // ===== GPS Validation =====
        if ($event->require_gps) {
            if ($event->latitude === null || $event->longitude === null) {
                return back()->with('error', 'Koordinat lokasi belum diatur oleh admin');
            }

            $data = $request->validate([
                'lat'      => ['required', 'numeric', 'between:-90,90'],
                'lng'      => ['required', 'numeric', 'between:-180,180'],
                'accuracy' => ['required', 'numeric', 'min:0', 'max:5000'],
            ]);

            if ($data['accuracy'] > 250) {
                return back()->with('error', 'Akurasi lokasi terlalu rendah (±' . round($data['accuracy']) . ' m). Coba di tempat terbuka atau pakai HP atau coba mendekat ke lokasi yang lebih dekat.');
            }

            $distance = $this->haversineMeters(
                (float) $data['lat'],
                (float) $data['lng'],
                (float) $event->latitude,
                (float) $event->longitude,
            );

            \Log::info('absen gps', [
                'user'     => $user->id,
                'event'    => $event->id,
                'distance' => round($distance),
                'radius'   => $event->radius_m,
                'accuracy' => $data['accuracy'],
            ]);

            // Tanpa toleransi: murni jarak vs radius
            if ($distance > (int) $event->radius_m) {
                return back()->with('error', 'Kamu di luar area. Jarak: ' . round($distance) . ' m, batas: ' . $event->radius_m . ' m');
            }

            $pivot += [
                'checkin_lat'        => $data['lat'],
                'checkin_lng'        => $data['lng'],
                'checkin_accuracy_m' => (int) round($data['accuracy']),
                'checkin_distance_m' => (int) round($distance),
            ];
        }

        $attendance->users()->syncWithoutDetaching([$user->id => $pivot]);

        return redirect()
            ->route('attendance.index', $attendance->id)
            ->with('success', 'Kehadiran berhasil dicatat (Hadir)');
    }

    private function haversineMeters(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earth = 6371000;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat/2)**2 + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng/2)**2;

        return 2 * $earth * asin((min(1, $a)));
    }

}
