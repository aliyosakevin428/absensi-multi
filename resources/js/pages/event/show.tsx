import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Event } from '@/types';
import { Link } from '@inertiajs/react';
import { QRCodeCanvas } from 'qrcode.react';
import { FC } from 'react';

type Props = {
    event: Event;
};

const ShowEvent: FC<Props> = ({ event }) => {
    const status = event.attendances?.[0]?.status || null;

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

                    <p className={`text-sm font-semibold ${statusColor}`}>Status: {statusText}</p>

                    {/* ================= QR CODE ================= */}
                    <div className="mt-8 flex flex-col items-center gap-2">
                        <p className="text-sm font-medium">QR Code Absensi</p>

                        {event.is_active && event.qr_token ? (
                            <>
                                <QRCodeCanvas value={route('attendance.scan', event.qr_token)} size={180} />
                                <p className="text-xs text-gray-500">Scan untuk melakukan absensi</p>
                            </>
                        ) : (
                            <p className="text-sm text-red-500">Event belum diaktifkan</p>
                        )}
                    </div>
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
