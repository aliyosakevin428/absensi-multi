import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Attendance } from '@/types';
import { Link } from '@inertiajs/react';
import { FC } from 'react';

type Props = {
    attendance: Attendance;
};

const ShowAttendance: FC<Props> = ({ attendance }) => {
    const status = attendance.status;

    let statusText = status;
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
        <AppLayout title="Detail Absensi" description="Detail absensi acara dihadiri oleh anggota">
            <Card>
                <CardHeader>
                    <CardTitle className="flex py-2">{attendance.event?.name}</CardTitle>
                    <CardDescription className="flex flex-col gap-5">
                        <p>
                            <strong>Tanggal Acara: </strong>
                            {attendance.event?.waktu_kegiatan
                                ? new Date(attendance.event.waktu_kegiatan).toLocaleString('id-ID', {
                                      weekday: 'long',
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                  })
                                : '-'}
                        </p>

                        <p>
                            <strong>Status: </strong> <span className={`font-semibold ${statusColor}`}>{statusText}</span>
                        </p>

                        <p>
                            <strong>Keterangan Absen: </strong> {attendance.absent_reason?.name ?? '-'}
                        </p>
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Grid Anggota */}
            <div className="mt-6">
                <h2 className="mb-5 text-lg font-bold">Anggota yang hadir :</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {attendance.users.map((user) => (
                        <Card key={user.id} className="p-4 shadow-sm">
                            <CardContent>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <div className="mt-4">
                                    <strong>Posisi:</strong>
                                    <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                                        {user.positions?.length ? (
                                            user.positions.map((pos) => (
                                                <label key={pos.id} className="flex items-center gap-2 rounded-md border p-2 hover:bg-gray-500">
                                                    <input type="checkbox" className="h-4 w-4 accent-blue-500" />
                                                    <span className="text-sm">{pos.name}</span>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400">Belum ada posisi</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <Button className="mt-4 rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700" asChild>
                    <Link href={route('attendance.index')} method="get">
                        Kembali
                    </Link>
                </Button>
            </div>
        </AppLayout>
    );
};

export default ShowAttendance;
