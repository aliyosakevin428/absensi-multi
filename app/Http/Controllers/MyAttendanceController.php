<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MyAttendanceController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'month'=> ['nullable', 'date_format:Y-m'],
        ]);

        $user = $request->user();
        $month = $validated['month'] ?? now()->format('Y-m');
        $start = Carbon::createFromFormat('Y-m-d', $month . '-01')->startOfMonth();
        $end = $start->copy()->endOfMonth();

        $since = $user->created_at?->copy()->startOfDay();

        $items = $this->rows($user->id, $start, $end, $since);

        $hadir = $items->where('status', 'hadir')->count();
        $tidak = $items->where('status', 'tidak_hadir')->count();
        $total = $hadir + $tidak;

        $firstMonth = now()->startOfMonth()->subMonths(5);

        $grouped = $this->rows($user->id, $firstMonth, now()->endOfMonth(), $since)
            ->whereIn('status', ['hadir', 'tidak_hadir'])
            ->groupBy(fn ($r) => Carbon::parse($r['waktu_kegiatan'])->format('Y-m'));

        $trend = collect(range(5, 0))->map(function ($i) use ($grouped) {
            $bulan = now()->startOfMonth()->subMonths($i)->format('Y-m');
            $rows = $grouped->get($bulan, collect());
            $h = $rows->where('status', 'hadir')->count();
            $t = $rows->count();

            return [
                'bulan' => $bulan,
                'hadir' => $h,
                'total' => $t,
                'persen' => $t ? (int) round($h / $t * 100) : null,
            ];
        })->values();

        return Inertia::render('my-attendance/index', [
            'month' => $month,
            'items' => $items->values(),
            'summary' => [
                'hadir' => $hadir,
                'tidak' => $tidak,
                'total' => $total,
                'persen' => $total ? round($hadir / $total * 100, 1) : null,
            ],
            'trend' => $trend,
        ]);
    }

    private function rows(int $userId, Carbon $from, Carbon $to, ?Carbon $since): Collection
    {
        $today = now()->startOfDay();

        return DB::table('attendances')
            ->join('events', 'events.id', '=', 'attendances.events_id')
            ->join('attendance_user as au', function ($join) use ($userId) {
                $join->on('au.attendance_id', '=', 'attendances.id')
                    ->where('au.user_id', '=', $userId);
            })
            // ->leftJoin('attendance_user as au', function ($join) use ($userId) {
            //     $join->on('au.attendance_id', '=', 'attendances.id')
            //         ->where('au.user_id', '=', $userId);
            // })--> jika user tidak checkin tetap di hitung sebagai tidak hadir atau tidak absen
            ->leftJoin('absent_reasons as ar', 'ar.id', '=', 'au.absent_reason_id')
            ->whereBetween('events.waktu_kegiatan', [$from, $to])
            ->when($since, fn ($q) => $q->where('events.waktu_kegiatan', '>=', $since))
            ->orderByDesc('events.waktu_kegiatan')
            ->get([
                'attendances.id as attendance_id',
                'attendances.status as event_status',
                'events.id as event_id',
                'events.name',
                'events.waktu_kegiatan',
                'events.lokasi_kegiatan',
                'au.attended_at',
                'ar.name as reason',
            ])
            ->map(function ($r) use ($today) {
                $status = $this->classify($r, $today);

                return [
                    'attendance_id' => $r->attendance_id,
                    'events_id' => $r->event_id,
                    'name' => $r->name,
                    'waktu_kegiatan' => $r->waktu_kegiatan,
                    'lokasi_kegiatan' => $r->lokasi_kegiatan,
                    'attended_at' => $r->attended_at,
                    'reason' => $status === 'hadir' ? null : $r->reason,
                    'status' => $status,
                ];
            });
    }

    private function classify(object $r, Carbon $today): string
    {
        if ($r->attended_at !== null) {
            return 'hadir';
        }

        if ($r->event_status === 'Dibatalkan') {
            return ' dibatalkan';
        }

        $selesai = $r->event_status === 'Sudah Terlaksana' || Carbon::parse($r->waktu_kegiatan)->lt($today);

        return $selesai ? 'tidak_hadir' : 'menunggu';
    }
}
