import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Event } from '@/types';
import { Link } from '@inertiajs/react';
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
        <AppLayout title="Detail Event" description="Detail event">
            <Card>
                <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>{event.waktu_kegiatan}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">
                        Lokasi: <span className="font-medium">{event.lokasi_kegiatan}</span>
                    </p>

                    <p className={`mt-2 text-sm font-semibold ${statusColor}`}>Status: {statusText}</p>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button className="mt-4 rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700" asChild>
                    <Link href={route('event.index')} method="get">
                        Kembali
                    </Link>
                </Button>
            </div>
        </AppLayout>
    );
};

export default ShowEvent;
