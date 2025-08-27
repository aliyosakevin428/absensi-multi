import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Attendance } from '@/types';
import { Link } from '@inertiajs/react';
import { FC } from 'react';

type Props = {
    attendance: Attendance;
};

const ShowAttendance: FC<Props> = ({ attendance }) => {
    console.log(attendance);
    return (
        <AppLayout title="Detail Absensi" description="Detail absensi acara dihadiri oleh anggota">
            <Card>
                <CardHeader>
                    <CardTitle>{attendance.event?.name}</CardTitle>
                    <CardDescription>
                        <p>
                            <strong>Status:</strong> {attendance.status}
                        </p>
                        <p>
                            <strong>Alasan Absen:</strong> {attendance.absent_reason?.name ?? '-'}
                        </p>

                        <div className="mt-4">
                            <strong>Anggota:</strong>
                            <ul className="list-inside list-disc">
                                {attendance.users.map((user) => (
                                    <li key={user.id}>{user.name}</li>
                                ))}
                            </ul>
                        </div>
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="flex justify-end">
                <Button className="mt-4 rounded-md bg-white px-3 py-1.5 text-sm text-black transition-colors hover:bg-gray-400" asChild>
                    <Link href={route('attendance.index')} method="get">
                        Kembali
                    </Link>
                </Button>
            </div>
        </AppLayout>
    );
};

export default ShowAttendance;
