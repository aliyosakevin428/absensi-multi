import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Attendance, User } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { FC, useState } from 'react';
import { toast } from 'sonner';

// Interface baru untuk user yang punya pivot attendance_user_positions
interface UserWithAttendancePositions extends User {
    attendance_user_positions?: { position_id: number }[];
}

type Props = {
    attendance: Attendance & {
        users: UserWithAttendancePositions[];
    };
};

const ShowAttendance: FC<Props> = ({ attendance }) => {
    // Status
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

    const [checkedPositions, setCheckedPositions] = useState<Record<number, number[]>>(() => {
        const initial: Record<number, number[]> = {};
        (attendance.users as UserWithAttendancePositions[]).forEach((user) => {
            initial[user.id] = user.attendance_user_positions?.map((p) => p.position_id) ?? [];
        });
        return initial;
    });

    const handleCheckboxChange = (userId: number, positionId: number) => {
        const current = checkedPositions[userId] || [];
        const newPositions = current.includes(positionId) ? current.filter((id) => id !== positionId) : [...current, positionId];

        setCheckedPositions((prev) => {
            const updated = { ...prev, [userId]: newPositions };
            form.setData('positions', updated); // update langsung ke form
            return updated;
        });
    };

    const form = useForm({
        positions: {} as Record<number, number[]>,
    });

    const handleSaveAll = () => {
        form.post(route('attendances.updatePositionsAll', attendance.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Absensi berhasil diubah');
                window.location.href = route('attendance.index');
            },
        });
    };

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
                            <strong>Status: </strong>
                            <span className={`font-semibold ${statusColor}`}>{statusText}</span>
                        </p>

                        <p>
                            <strong>Keterangan Absen: </strong>
                            {attendance.absent_reason?.name ?? '-'}
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
                                                    <input
                                                        type="checkbox"
                                                        checked={checkedPositions[user.id]?.includes(pos.id) || false}
                                                        onChange={() => handleCheckboxChange(user.id, pos.id)}
                                                    />
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

            {/* Tombol Simpan Semua */}
            <div className="mt-4 flex justify-end gap-2">
                <Button className="rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700" onClick={handleSaveAll}>
                    Simpan Semua
                </Button>
                <Button className="rounded-md bg-red-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-700" asChild>
                    <Link href={route('attendance.index')} method="get">
                        Kembali
                    </Link>
                </Button>
            </div>
        </AppLayout>
    );
};

export default ShowAttendance;
