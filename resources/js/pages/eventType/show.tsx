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
    const getEventStatus = (event: Event) => {
        const hasAttendances = event.attendances && event.attendances.length > 0;

        if (hasAttendances) {
            const attendance = event.attendances[0];
            const status = attendance.status?.toLowerCase();

            switch (status) {
                case 'dibatalkan':
                case 'batal':
                    return { text: 'Dibatalkan', color: 'bg-red-100 text-red-800' };
                case 'ditunda':
                case 'tunda':
                    return { text: 'Ditunda', color: 'bg-yellow-100 text-yellow-800' };
                case 'pending':
                case 'menunggu':
                    return { text: 'Menunggu', color: 'bg-blue-100 text-blue-800' };
                case 'akan datang':
                case 'rencana':
                    return { text: 'Akan Datang', color: 'bg-purple-100 text-purple-800' };
                case 'hadir':
                case 'terlaksana':
                case 'selesai':
                default:
                    return { text: 'Terlaksana', color: 'bg-green-100 text-green-800' };
            }
        }

        if (!event.waktu_kegiatan) {
            return { text: 'Belum Dijadwalkan', color: 'bg-gray-100 text-gray-800' };
        }

        const eventDate = new Date(event.waktu_kegiatan);
        const now = new Date();

        const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (eventDateOnly < nowDateOnly) {
            return { text: 'Sudah Terlaksana', color: 'bg-green-100 text-green-800' };
        }
        if (eventDateOnly.getTime() === nowDateOnly.getTime()) {
            return { text: 'Hari Ini', color: 'bg-blue-100 text-blue-800' };
        }

        const diffDays = Math.ceil((eventDateOnly.getTime() - nowDateOnly.getTime()) / (1000 * 60 * 60 * 24));

        return { text: `${diffDays} Hari Lagi`, color: 'bg-yellow-100 text-yellow-800' };
    };

    return (
        <AppLayout title="Detail Jenis Acara" description="Daftar acara berdasarkan jenis yang dipilih">
            <Card>
                <CardHeader>
                    <CardTitle>{eventType.name}</CardTitle>
                    <CardDescription>Daftar acara yang termasuk dalam kategori ini.</CardDescription>
                </CardHeader>
            </Card>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {eventType.events?.length ? (
                    eventType.events.map((event: Event) => {
                        const status = getEventStatus(event);

                        return (
                            <Card key={event.id} className="shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg">{event.name}</CardTitle>
                                        <span className={`rounded-full px-2 py-1 text-xs ${status.color}`}>{status.text}</span>
                                    </div>
                                    <CardDescription>
                                        {event.waktu_kegiatan
                                            ? new Date(event.waktu_kegiatan).toLocaleString('id-ID', {
                                                  weekday: 'long',
                                                  day: '2-digit',
                                                  month: 'long',
                                                  year: 'numeric',
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                              })
                                            : 'Tanggal belum ditentukan'}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-sm text-gray-500">📍 {event.lokasi_kegiatan || 'Lokasi belum ditentukan'}</p>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <p className="col-span-full text-center text-sm text-gray-500">Belum ada event untuk tipe ini.</p>
                )}
            </div>

            <div className="mt-6 flex justify-end">
                <Button asChild>
                    <Link href={route('event-type.index')}>Kembali</Link>
                </Button>
            </div>
        </AppLayout>
    );
};

export default ShowEventType;
