import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { AbsentReason, Attendance, User } from '@/types';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { FC, useState } from 'react';
import { toast } from 'sonner';
import UploadMedia from './components/upload-media';

// Interface baru untuk user yang punya pivot attendance_user_positions
interface UserWithAttendancePositions extends User {
    attendancePositions: { position_id: number }[];
    my_absent_reason_id?: number | null;
    pivot?: {
        absent_reason_id?: number | null;
        attended_at?: string | null;
    };
}

type Props = {
    attendance: Attendance & {
        users: UserWithAttendancePositions[];
    };
    absent: AbsentReason[];
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

const ShowAttendance: FC<Props> = ({ attendance, absent }) => {
    const { props } = usePage<AuthProps>();
    const roles = props.auth?.roles || [];
    const isSuperOrAdmin = roles.some((role) => role.toLowerCase() === 'superadmin' || role.toLowerCase() === 'admin');
    const [selected, setSelected] = useState<number[]>([]);
    const [mediaList] = useState(attendance.media);
    const [absentReasons, setAbsentReasons] = useState<Record<number, number | null>>(() => {
        const init: Record<number, number | null> = {};
        attendance.users.forEach((u) => {
            init[u.id] = u.my_absent_reason_id ?? null;
        });
        return init;
    });

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

    const handleAbsentChange = (userId: number, value: number) => {
        if (!isSuperOrAdmin && authUser?.id !== userId) {
            toast.error('Kamu tidak boleh mengubah kehadiran anggota lain');
            return;
        }

        setAbsentReasons((prev) => ({
            ...prev,
            [userId]: value,
        }));

        if (isSuperOrAdmin) {
            form.setData('absent_reasons', {
                ...form.data.absent_reasons,
                [userId]: value,
            });
        }
    };

    const authUser = props.auth?.user;
    const isJoined = attendance.users.some((user) => user.id === authUser?.id);
    const isClosed = status === 'Dibatalkan' || status === 'Sudah Terlaksana';

    const myPositions = checkedPositions[authUser?.id || 0] || [];

    const handleCheckboxChange = (userId: number, positionId: number) => {
        const current = checkedPositions[userId] || [];
        const newPositions = current.includes(positionId) ? current.filter((id) => id !== positionId) : [...current, positionId];

        setCheckedPositions((prev) => {
            const updated = { ...prev, [userId]: newPositions };
            form.setData('positions', updated); // update langsung ke form untuk admin

            if (userId === authUser?.id) {
                myForm.setData('positions', updated[userId]); // update langsung ke myForm untuk user/anggota biasa
            }
            return updated;
        });
    };

    const form = useForm({
        positions: checkedPositions, // to save checked position in pivot table
        absent_reasons: absentReasons, // to save absent reasons in pivot table
    });

    const myForm = useForm({
        positions: myPositions, //update my positions for user only
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

    const handleSaveMyPosition = () => {
        if (!authUser) return;

        const myOnlyData: Record<number, number[]> = {
            [authUser.id]: checkedPositions[authUser.id] || [],
        };

        router.post(
            route('attendance.updateMyPosition', attendance.id),
            {
                positions: myOnlyData, // <-- ini posisi user
                absent_reason_id: absentReasons[authUser.id], // <-- ini status kehadiran user
            },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const errors = page.props?.errors;

                    if (errors?.message) {
                        toast.error(errors.message);
                    } else {
                        toast.success('Data berhasil disimpan');
                        window.location.href = route('attendance.show', attendance.id);
                    }
                },
            },
        );
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

                        {/* <p>
                            <strong>Keterangan Absen: </strong>
                            {attendance.absent_reason?.name ?? '-'}
                        </p> */}
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

                                {/* Posisi */}
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
                                                        disabled={authUser?.id !== user.id && !isSuperOrAdmin}
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

                                {/* Absent Reason Dropdown */}
                                <div className="mt-4">
                                    <strong>Status Kehadiran:</strong>
                                    <Select
                                        value={absentReasons[user.id]?.toString() ?? ''}
                                        onValueChange={(val) => handleAbsentChange(user.id, Number(val))}
                                        disabled={authUser?.id !== user.id && !isSuperOrAdmin}
                                    >
                                        <SelectTrigger className="mt-2 w-fit">
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {absent.map((item) => (
                                                <SelectItem key={item.id} value={item.id.toString()}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Waktu Kehadiran */}
                                <div className="mt-3">
                                    <strong>Waktu Absen:</strong>
                                    {user.attended_at ? (
                                        <p className="text-sm text-green-600">
                                            {new Date(user.attended_at).toLocaleString('id-ID', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-500">Belum absen</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {/* Tombol Cancel Absensi */}
                {!isClosed && authUser && isJoined && (
                    <div className="mt-4 flex justify-end">
                        <Button
                            className="bg-yellow-500 text-white hover:bg-yellow-600"
                            onClick={() => router.delete(route('attendance.cancel', attendance.id))}
                        >
                            Batalkan Kehadiran
                        </Button>
                    </div>
                )}
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

            {/* Tombol Simpan Semua untuk admin */}
            <div className="mt-4 flex justify-end gap-2">
                {isSuperOrAdmin && (
                    <Button
                        className="rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700"
                        onClick={handleSaveAll}
                    >
                        Simpan
                    </Button>
                )}
                {/* Tombol Simpan Posisi Saya untuk user */}
                {!isSuperOrAdmin && authUser && (
                    <Button className="rounded-md bg-blue-400 px-3 py-1.5 text-sm text-white hover:bg-blue-600" onClick={handleSaveMyPosition}>
                        Simpan Posisi Saya
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
