import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Position, User } from '@/types';
import { Link } from '@inertiajs/react';
import { FC } from 'react';

type Props = {
    position: Position;
};

const ShowPosition: FC<Props> = ({ position }) => {
    const formatPhone = (phone: string) => {
        const digits = phone.replace(/\D/g, ''); // hapus karakter non-digit
        if (digits.length === 12) return digits.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
        if (digits.length === 11) return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        return phone; // fallback jika panjang berbeda
    };

    return (
        <AppLayout title="Detail Position" description="Detail posisi dan user terkait">
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-center text-xl font-semibold">{position.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    {position.users?.length ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">#</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Nomor Handphone</TableHead>
                                    <TableHead>Tim</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {position.users.map((user: User, index: number) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.kontak ? formatPhone(user.kontak) : '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                <Link href={route('team.show', user.team?.id)}>{user.team?.name || 'Tanpa Tim'}</Link>
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-sm text-gray-500">Belum ada user untuk posisi ini.</p>
                    )}
                </CardContent>
            </Card>
            <div className="flex justify-end">
                <Button className="mt-4 w-fit rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700" asChild>
                    <Link href={route('position.index')} method="get">
                        Kembali
                    </Link>
                </Button>
            </div>
        </AppLayout>
    );
};

export default ShowPosition;
