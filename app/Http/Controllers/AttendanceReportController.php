<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\LaravelPdf\Facades\Pdf;

class AttendanceReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('attendance/index', [
            'filters' => $request->only(['month', 'search'],)
        ]);
    }

    public function export(Request $request)
    {
        $request->validate([
            'month' => ['required', 'date_format:Y-m'],
            'format' => ['required', 'in:pdf'],
            'search' => ['nullable', 'string'],
        ]);

        [$year, $month] = explode('-', $request->month);

        $start = Carbon::create((int) $year, (int) $month, 1)->startOfMonth();
        $end = (clone $start)->endOfMonth();

        $search = $request->search;

        $rekap = DB::table('events')
            ->join('attendances', 'attendances.events_id', '=', 'events.id')
            ->leftJoin('attendance_user as au', 'au.attendance_id', '=', 'attendances.id')
            ->whereBetween('events.waktu_kegiatan', [$start, $end])
            ->select([
                'events.id',
                'events.name',
                'events.waktu_kegiatan',
            ])
            ->selectRaw('COUNT(au.id) as total_terdaftar')
            ->selectRaw('SUM(CASE WHEN au.attended_at IS NOT NULL THEN 1 ELSE 0 END) as total_hadir')
            ->groupBy('events.id', 'events.name', 'events.waktu_kegiatan')
            ->orderBy('events.waktu_kegiatan', 'asc')
            ->get()
            ->map(function ($row) {
                $row->persentase = $row->total_terdaftar > 0
                    ? round(($row->total_hadir / $row->total_terdaftar) * 100, 2)
                    : 0;
                return $row;
            });

        $detailHadir = DB::table('attendance_user as au')
            ->join('attendances', 'attendances.id', '=', 'au.attendance_id')
            ->join('events', 'events.id', '=', 'attendances.events_id')
            ->join('users', 'users.id', '=', 'au.user_id')
            ->leftJoin('teams', 'teams.id', '=', 'users.team_id')
            ->leftJoin('attendance_user_position as aup', function ($join) {
                $join->on('aup.attendance_id', '=', 'attendances.id')
                    ->on('aup.user_id', '=', 'users.id');
            })
            ->leftJoin('positions', 'positions.id', '=', 'aup.position_id')
            ->whereBetween('events.waktu_kegiatan', [$start, $end])
            ->whereNotNull('au.attended_at')
            ->select([
                'events.name as event_name',
                'events.waktu_kegiatan',
                'users.name as user_name',
                'positions.name as position_name',
                'teams.name as team_name',
                'au.attended_at',
            ])
            ->orderBy('events.waktu_kegiatan', 'asc')
            ->orderBy('users.name', 'asc')
            ->get();

        $totalTerdaftar = (int) $rekap->sum('total_terdaftar');
        $totalHadir = (int) $rekap->sum('total_hadir');
        $persenBulanan = $totalTerdaftar > 0 ? round(($totalHadir / $totalTerdaftar) * 100, 2) : 0;

        $filename = `laporan-kehadiran-{$request->month}.pdf`;

        return Pdf::view('pdf.attendance-monthly', [
            'month' => $request->month,
            'rekap' => $rekap,
            'detailHadir' => $detailHadir,
            'totalTerdaftar' => $totalTerdaftar,
            'totalHadir' => $totalHadir,
            'persenBulanan' => $persenBulanan
        ])
        ->format('a4')
        ->landscape()
        ->download($filename);
    }

}
