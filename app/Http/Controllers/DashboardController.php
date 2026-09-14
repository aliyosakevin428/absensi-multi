<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        Carbon::setLocale('id');

        $years = DB::table('events')
            ->join('attendances', 'attendances.events_id', '=', 'events.id')
            ->where('attendances.status', 'Sudah Terlaksana')
            ->selectRaw('DISTINCT YEAR(events.waktu_kegiatan) as year')
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();

        $fallbackYear = count($years) ? max($years) : (int) now()->year;
        $year = (int) $request->query('year', $fallbackYear);
        if (!in_array($year, $years)) {
            $years[] = $year;
        }
        sort($years);

        $eventsAgg = DB::table('attendances')
            ->join('events', 'attendances.events_id', '=', 'events.id')
            ->selectRaw('MONTH(events.waktu_kegiatan) as month, COUNT(*) as total')
            ->where('attendances.status', 'Sudah Terlaksana')
            ->whereYear('events.waktu_kegiatan', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        $chartData = collect(range(1, 12))->map(function ($m) use ($eventsAgg, $year) {
            return [
                'month' => Carbon::createFromDate($year, $m, 1)->translatedFormat('M'),
                'total' => (int) optional($eventsAgg->get($m))->total ?? 0,
            ];
        });

        $attendancePerUser = DB::table('attendance_user')
            ->join('users', 'attendance_user.user_id', '=', 'users.id')
            ->join('attendances', 'attendance_user.attendance_id', '=', 'attendances.id')
            ->join('events', 'attendances.events_id', '=', 'events.id')
            ->where('attendances.status', 'Sudah Terlaksana')
            ->whereYear('events.waktu_kegiatan', $year)
            ->whereNull('attendance_user.absent_reason_id') 
            ->select('users.name', DB::raw('COUNT(attendance_user.user_id) as total'))
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('total')
            ->get();

        return Inertia::render('dashboard/index', [
            'year' => $year,
            'years' => $years,
            'chartData' => $chartData->toArray(),
            'attendancePerUser' => $attendancePerUser->toArray(),
        ]);
    }
}
