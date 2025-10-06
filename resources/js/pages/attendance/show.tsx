import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Attendance, User } from '@/types';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { FC, useState } from 'react';
import { toast } from 'sonner';
import UploadMedia from './components/upload-media';

// Interface baru untuk user yang punya pivot attendance_user_positions
interface UserWithAttendancePositions extends User {
    attendancePositions: { position_id: number }[];
}

type Props = {
    attendance: Attendance & {
        users: UserWithAttendancePositions[];
    };
};

type AuthProps = {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
        roles: string[];
    };
};

const ShowAttendance: FC<Props> = ({ attendance }) => {
    const { props } = usePage<AuthProps>();
    const roles = props.auth?.roles || [];
    const isSuperOrAdmin = roles.includes('Superadmin') || roles.includes('admin');
    const [selected, setSelected] = useState<number[]>([]);
    const [mediaList] = useState(attendance.media);

    const toggleSelect = (id: number) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

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
        attendance.users.forEach((user) => {
            initial[user.id] = Array.isArray(user.attendancePositions) ? user.attendancePositions.map((p) => p.position_id) : [];
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
        positions: checkedPositions,
    });

    // const formDelete = useForm<{ ids: number[] }>({
    //     ids: [],
    // });

    const handleSaveAll = () => {
        form.post(route('attendances.updatePositionsAll', attendance.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Absensi berhasil diubah');
                window.location.href = route('attendance.index');
            },
        });
    };

    const handleDelete = () => {
        console.log('Delete media dengan id:', selected);

        router.delete(route('attendances.media.destroyBulk', attendance.id), {
            data: { ids: selected },
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Media berhasil dihapus');
                setSelected([]);
                window.location.href = route('attendance.show', attendance.id);
            },
        });
    };

    console.log(attendance.media);

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
                <h2 className="mb-5 text-lg font-bold">Anggota yang Terdaftar:</h2>
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
                                                <label
                                                    key={pos.id}
                                                    className="flex items-center gap-2 rounded-md border p-2 hover:!bg-secondary hover:!text-foreground"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={checkedPositions[user.id]?.includes(pos.id) || false}
                                                        onChange={() => handleCheckboxChange(user.id, pos.id)}
                                                    />
                                                    <span className="text-sm">{pos.name}</span>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-600">Belum ada posisi</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Grid Media */}
            <div className="mt-8 px-1 py-5">
                <h2 className="mb-4 text-lg font-semibold">Dokumentasi Acara:</h2>

                {/* Grid Gambar */}
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                    {mediaList.map((media) => (
                        <label key={media.id} className="group relative cursor-pointer overflow-hidden rounded-lg border bg-transparent shadow-sm">
                            {/* Checkbox (hidden tapi masih bisa di-toggle lewat label) */}
                            <input
                                type="checkbox"
                                checked={selected.includes(media.id)}
                                onChange={() => toggleSelect(media.id)}
                                className="absolute top-2 left-2 z-10 h-4 w-4"
                            />

                            {/* Gambar */}
                            <img
                                src={media.original_url}
                                alt={media.file_name}
                                className={`h-40 w-full object-cover transition group-hover:opacity-80 ${
                                    selected.includes(media.id) ? 'opacity-70 ring-4 ring-blue-200' : ''
                                }`}
                            />

                            {/* Nama file */}
                            <div className="truncate p-2 text-center text-sm text-foreground">{media.file_name}</div>
                        </label>
                    ))}
                </div>

                {/* Tombol Hapus */}
                {selected.length > 0 && (
                    <div className="mt-6 flex justify-end">
                        <button onClick={handleDelete} className="rounded-md bg-red-500 px-4 py-2 text-white shadow hover:bg-red-600">
                            Hapus {selected.length} File
                        </button>
                    </div>
                )}
            </div>

            <UploadMedia attendance={attendance} />

            {/* Tombol Simpan Semua */}
            <div className="mt-4 flex justify-end gap-2">
                {isSuperOrAdmin && (
                    <Button
                        className="rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700"
                        onClick={handleSaveAll}
                    >
                        Simpan
                    </Button>
                )}
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
