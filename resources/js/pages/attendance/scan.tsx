import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Attendance, Event, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';

type Props = {
    event: Event;
    attendance: Attendance | null;
    alreadyJoined: boolean;
};

export default function ScanAttendance({ event, attendance, alreadyJoined }: Props) {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    const handleJoin = () => {
        if (!attendance) return;

        router.post(route('attendance.present', attendance.id));
    };

    return (
        <AppLayout title="Absensi Kegiatan" description="Scan QR Code Absensi">
            <div className="flex justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>{event.name}</CardTitle>
                        <CardDescription>
                            {event.waktu_kegiatan} <br />
                            {event.lokasi_kegiatan}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {!event.is_active && <p className="text-center text-sm text-red-500">Kegiatan ini belum aktif atau sudah berakhir.</p>}

                        {!user && (
                            <div className="space-y-2 text-center">
                                <p className="text-sm">Silakan login untuk melakukan absensi</p>
                                <Button asChild className="w-full">
                                    <Link href={route('login')}>Login</Link>
                                </Button>
                            </div>
                        )}

                        {user && alreadyJoined && <p className="text-center text-sm font-semibold text-green-600">Kamu sudah melakukan absensi ✔</p>}

                        {user && !alreadyJoined && event.is_active && (
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleJoin}>
                                Hadir
                            </Button>
                        )}
                    </CardContent>
                    <div className="flex-col flex object-center text-center">
                        {attendance && <p className="text-mute-forground text-sm">Status Event: {attendance.status}</p>}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
