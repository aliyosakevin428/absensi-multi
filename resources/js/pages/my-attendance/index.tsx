import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Status = 'hadir' | 'tidak_hadir' | 'menunggu' | 'dibatalkan';

type Item = {
    attendance_id: number;
    event_id: number;
    name: string;
    waktu_kegiatan: string;
    lokasi_kegiatan: string;
    attended_at: string | null;
    reason: string | null;
    status: Status;
};

type Props = {
    month: string;
    items: Item[];
    summary: { hadir: number; tidak: number; total: number; persen: number | null };
    trend: { bulan: string; hadir: number; total: number; persen: number | null }[];
};

const statusMap: Record<Status, { label: string; className: string }> = {
    hadir: { label: 'Hadir', className: 'text-green-600' },
    tidak_hadir: { label: 'Tidak Hadir', className: 'text-red-500' },
    menunggu: { label: 'Menunggu', className: 'text-blue-500' },
    dibatalkan: { label: 'Dibatalkan', className: 'text-gray-500' },
};

const barColor = (persen: number) => (persen >= 80 ? 'bg-green-600' : persen >= 60 ? 'bg-yellow-500' : 'bg-red-500');

function Bar({ persen }: { persen: number | null }) {
    return (
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            {persen !== null && <div className={`h-full ${barColor(persen)}`} style={{ width: `${persen}%` }} />}
        </div>
    );
}

export default function MyAttendance({ month, items, summary, trend }: Props) {
    const current = dayjs(month + '-01');
    const prev = current.subtract(1, 'month').format('YYYY-MM');
    const next = current.add(1, 'month').format('YYYY-MM');
    const isLatest = month >= dayjs().format('YYYY-MM');

    const go = (value: string) => {
        if (!value) return;
        router.get(route('my-attendance.index'), { month: value }, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <AppLayout title="Kehadiran Saya" description="Riwayat dan persentase kehadiranmu">
            <div className="space-y-4">
                {/* Navigasi bulan */}
                <div className="flex items-center justify-between gap-2">
                    <Button type="button" variant="outline" size="icon" onClick={() => go(prev)} aria-label="Bulan sebelumnya">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <h2 className="text-lg font-semibold">{current.format('MMMM YYYY')}</h2>

                    <Button type="button" variant="outline" size="icon" onClick={() => go(next)} disabled={isLatest} aria-label="Bulan berikutnya">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Ringkasan */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardDescription>Hadir</CardDescription>
                            <CardTitle className="text-3xl text-green-600">{summary.hadir}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardDescription>Tidak hadir</CardDescription>
                            <CardTitle className="text-3xl text-red-500">{summary.tidak}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardDescription>Persentase</CardDescription>
                            <CardTitle className="text-3xl">{summary.persen === null ? '-' : `${summary.persen}%`}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex">
                                <Bar persen={summary.persen === null ? null : Math.round(summary.persen)} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {summary.total > 0 ? `dari ${summary.total} kegiatan yang sudah selesai` : 'Belum ada kegiatan selesai di bulan ini'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tren */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tren 6 bulan terakhir</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {trend.map((t) => (
                            <button
                                type="button"
                                key={t.bulan}
                                onClick={() => go(t.bulan)}
                                className="flex w-full items-center gap-3 rounded px-1 py-0.5 text-left text-sm hover:bg-muted/50"
                            >
                                <span className="w-20 shrink-0">{dayjs(t.bulan + '-01').format('MMM YYYY')}</span>
                                <Bar persen={t.persen} />
                                <span className="w-28 shrink-0 text-right">{t.total > 0 ? `${t.hadir}/${t.total} (${t.persen}%)` : '-'}</span>
                            </button>
                        ))}
                    </CardContent>
                </Card>

                {/* Riwayat */}
                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat kegiatan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {items.length === 0 && <p className="text-sm text-muted-foreground">Tidak ada kegiatan di bulan ini.</p>}

                        {items.map((it) => (
                            <div key={it.attendance_id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                                <div className="text-sm">
                                    <p className="font-medium">{it.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {dayjs(it.waktu_kegiatan).format('ddd, DD MMM YYYY HH:mm')} · {it.lokasi_kegiatan}
                                    </p>
                                    {it.status === 'hadir' && it.attended_at && (
                                        <p className="text-xs text-green-600">Check-in {dayjs(it.attended_at).format('HH:mm')}</p>
                                    )}
                                    {it.reason && <p className="text-xs opacity-80">Alasan: {it.reason}</p>}
                                </div>

                                <Badge variant="outline" className={`shrink-0 ${statusMap[it.status].className}`}>
                                    {statusMap[it.status].label}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
