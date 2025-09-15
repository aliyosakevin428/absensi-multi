<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
       // Ambil data event yang sudah terlaksana (status di attendances, tanggal di events)
        $events = DB::table('attendances')
            ->join('events', 'attendances.events_id', '=', 'events.id')
            ->selectRaw('MONTH(events.waktu_kegiatan) as month, COUNT(*) as total')
            ->where('attendances.status', 'Sudah Terlaksana')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month'); // supaya mudah diakses berdasarkan angka bulan

        // Generate data 12 bulan (agar bulan kosong tetap muncul dengan total 0)
        $data = collect(range(1, 12))->map(function ($month) use ($events) {
            return [
                'month' => Carbon::create()->month($month)->translatedFormat('M'),
                'total' => $events[$month]->total ?? 0,
            ];
        });

        // Chart kedua: jumlah kehadiran per user
        $attendancePerUser = DB::table('attendance_user')
        ->join('users', 'attendance_user.user_id', '=', 'users.id')
        ->join('attendances', 'attendance_user.attendance_id', '=', 'attendances.id')
        ->where('attendances.status', 'Sudah Terlaksana')
        ->select('users.name', DB::raw('COUNT(attendance_user.user_id) as total'))
        ->groupBy('users.id', 'users.name')
        ->get();

        // Kirim ke inertia
        return Inertia::render('dashboard/index', [
            'chartData' => $data->toArray(),
            'attendancePerUser' => $attendancePerUser->toArray(),
        ]);
    }
}
