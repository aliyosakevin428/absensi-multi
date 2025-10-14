import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { FC } from 'react';

type Props = {
    absentReason: {
        id: number;
        name: string;
    };
    users: {
        id: number;
        name: string;
        attendanceDates: string[];
    }[];
};

const ShowAbsentReason: FC<Props> = ({ absentReason, users }) => {
    return (
        <AppLayout title="Detail Absen" description="Detail alasan absen">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {absentReason.name} {users.length > 0 && `(${users.length} orang)`}
                    </CardTitle>
                    <CardDescription>Daftar anggota yang menggunakan alasan ini.</CardDescription>
                </CardHeader>

                <CardContent>
                    {users.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableCaption>Total: {users.length} anggota menggunakan alasan ini.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">#</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Tanggal Absen</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user, i) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>
                                                {user.attendanceDates.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.attendanceDates.map((date, idx) => (
                                                            <span key={idx} className="rounded-md bg-muted px-2 py-0.5 text-xs">
                                                                {new Date(date).toLocaleDateString('id-ID', {
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                })}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Belum ada anggota yang pakai alasan ini.</p>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
};

export default ShowAbsentReason;
