import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Event } from '@/types';
import { Link } from '@inertiajs/react';
import { QRCodeCanvas } from 'qrcode.react';
import { FC, lazy, Suspense } from 'react';

type Props = {
    event: Event;
};

const ShowEvent: FC<Props> = ({ event }) => {
    const qrUrl = event.is_active && event.qr_token ? route('attendance.scan', { qr_token: event.qr_token }) : null;

    const status = event.attendances?.[0]?.status || null;

    const LocationViewer = lazy(() => import('@/components/location-viewer'));

    const hasLocation = event.latitude !== null && event.longitude !== null;
    const lat = Number(event.latitude);
    const lng = Number(event.longitude);

    let statusText = 'Belum ada data';
    let statusColor = 'text-gray-500';

    switch (status) {
        case 'Rencana':
            statusText = 'Rencana';
            statusColor = 'text-blue-500';
            break;
        case 'Sedang Berlangsung':
            statusText = 'Sedang berlangsung';
            statusColor = 'text-yellow-500';
            break;
        case 'Sudah Terlaksana':
            statusText = 'Sudah terlaksana';
            statusColor = 'text-green-600';
            break;
        case 'Dibatalkan':
            statusText = 'Dibatalkan';
            statusColor = 'text-red-600';
            break;
    }

    return (
        <AppLayout title="Detail Acara" description="Detail acara yang terdaftar di sistem">
            <Card>
                <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>{event.waktu_kegiatan}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-sm">
                        Lokasi: <span className="font-medium">{event.lokasi_kegiatan}</span>
                    </p>

                    <Badge variant="outline" className={statusColor}>
                        {statusText}
                    </Badge>
                </CardContent>
            </Card>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Lokasi Kegiatan</CardTitle>
                    <CardDescription>
                        {event.require_gps
                            ? `Absensi kegiatan ini wajib menggunakan GPS, radius ${event.radius_m} meter`
                            : 'Absensi kegiatan ini tidak wajib menggunakan GPS'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {hasLocation ? (
                        <>
                            <Suspense fallback={<div className="h-72 animate-pulse rounded-md bg-muted" />}>
                                <LocationViewer
                                    latitude={lat}
                                    longitude={lng}
                                    radius={Number(event.radius_m) || 100}
                                    showRadius={event.require_gps}
                                />
                            </Suspense>
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                                <span>
                                    {lat.toFixed(6)}, {lng.toFixed(6)}
                                </span>
                                <a
                                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    Buka di Google Maps
                                </a>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500">Titik lokasi belum diatur untuk kegiatan ini.</p>
                    )}
                </CardContent>
            </Card>

            <Card className="mt-4">
                <CardHeader className="flex flex-col items-center">
                    <CardTitle>Absensi Kegiatan</CardTitle>
                    <CardDescription>Scan QR Code untuk melakukan absensi</CardDescription>
                </CardHeader>

                <CardContent className="flex justify-center">
                    <div className="mt-8 flex flex-col items-center gap-2">
                        <p className="text-sm font-medium">QR Code Absensi</p>

                        {qrUrl ? (
                            <>
                                <QRCodeCanvas value={qrUrl} size={180} />

                                <p className="text-xs text-gray-500">Scan untuk melakukan absensi</p>
                            </>
                        ) : (
                            <p className="text-sm text-red-500">Event belum diaktifkan</p>
                        )}
                    </div>{' '}
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button className="mt-4 rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700" asChild>
                    <Link href={route('event.index')}>Kembali</Link>
                </Button>
            </div>
        </AppLayout>
    );
};

export default ShowEvent;
