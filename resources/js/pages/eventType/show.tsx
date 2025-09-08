import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Event, EventType } from '@/types';
import { Link } from '@inertiajs/react';
import { FC } from 'react';

type Props = {
    eventType: EventType;
};

const ShowEventType: FC<Props> = ({ eventType }) => {
    return (
        <AppLayout title="Detail Jenis Acara" description="Daftar acara berdasarkan jenis yang dipilih">
            {/* Header event type */}
            <Card>
                <CardHeader>
                    <CardTitle>{eventType.name}</CardTitle>
                    <CardDescription>Daftar acara yang termasuk dalam kategori ini.</CardDescription>
                </CardHeader>
            </Card>

            {/* List event */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {eventType.events?.length ? (
                    eventType.events.map((event: Event) => (
                        <Card key={event.id} className="shadow-sm">
                            <CardHeader>
                                <CardTitle>{event.name}</CardTitle>
                                <CardDescription>
                                    {event.waktu_kegiatan
                                        ? new Date(event.waktu_kegiatan).toLocaleString('id-ID', {
                                              day: '2-digit',
                                              weekday: 'long',
                                              month: '2-digit',
                                              year: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : '-'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-400">{event.lokasi_kegiatan}</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="col-span-full text-center text-sm text-gray-500">Belum ada event untuk tipe ini.</p>
                )}
            </div>
            <div className="flex justify-end">
                <Button className="mt-4 rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700" asChild>
                    <Link href={route('event-type.index')} method="get">
                        Kembali
                    </Link>
                </Button>
            </div>
        </AppLayout>
    );
};

export default ShowEventType;
