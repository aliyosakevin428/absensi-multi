<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #333; padding: 6px; vertical-align: top; }
        th { background: #f2f2f2; }
        thead { display: table-header-group; }
        tr { page-break-inside: avoid; }
        .mb { margin-bottom: 12px; }
    </style>
</head>
<body>
    <div class="mb">
        <div><strong>Laporan Kehadiran Bulanan</strong></div>
        <div>Bulan: {{ $month }}</div>
        <div>Total Terdaftar: {{ $totalTerdaftar }} | Total Hadir: {{ $totalHadir }} | Persentase: {{ $persenBulanan }}%</div>
    </div>

    <div class="mb">
        <strong>Rekap Per Kegiatan</strong>
        <table>
            <thead>
                <tr>
                    <th style="width:40px;">No</th>
                    <th>Kegiatan</th>
                    <th style="width:150px;">Tanggal</th>
                    <th style="width:110px;">Total</th>
                    <th style="width:90px;">Hadir</th>
                    <th style="width:90px;">%</th>
                </tr>
            </thead>
            <tbody>
                @foreach($rekap as $i => $row)
                    <tr>
                        <td>{{ $i+1 }}</td>
                        <td>{{ $row->name }}</td>
                        <td>{{ \Carbon\Carbon::parse($row->waktu_kegiatan)->format('d M Y H:i') }}</td>
                        <td>{{ $row->total_terdaftar }}</td>
                        <td>{{ $row->total_hadir }}</td>
                        <td>{{ $row->persentase }}%</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div>
        <strong>Daftar Hadir (Status: HADIR)</strong>
        <table>
            <thead>
                <tr>
                    <th>Kegiatan</th>
                    <th style="width:150px;">Tanggal</th>
                    <th>Nama</th>
                    <th style="width:140px;">Position</th>
                    <th style="width:140px;">Team</th>
                </tr>
            </thead>
            <tbody>
                @foreach($detailHadir as $row)
                    <tr>
                        <td>{{ $row->event_name }}</td>
                        <td>{{ \Carbon\Carbon::parse($row->waktu_kegiatan)->format('d M Y H:i') }}</td>
                        <td>{{ $row->user_name }}</td>
                        <td>{{ $row->position_name ?? '-' }}</td>
                        <td>{{ $row->team_name ?? '-' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
</html>
