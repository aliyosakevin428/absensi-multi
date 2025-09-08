import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Team, User } from '@/types';
import { Link } from '@inertiajs/react';
import { FC } from 'react';

type Props = {
    team: Team;
};

const ShowTeam: FC<Props> = ({ team }) => {
    const formatPhone = (phone: string) => {
        const digits = phone.replace(/\D/g, ''); // hapus karakter non-digit
        if (digits.length === 12) return digits.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
        if (digits.length === 11) return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        return phone; // fallback jika panjang berbeda
    };

    return (
        <AppLayout title="Detail Team" description="Daftar Anggota yang terdaftar dalam tim">
            <Card>
                <CardHeader>
                    <CardTitle>{team.name}</CardTitle>
                    <CardDescription>Berikut adalah daftar anggota tim yang terdaftar dalam sistem.</CardDescription>
                </CardHeader>
            </Card>

            {/* List Anggota */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {team.users?.map((user: User) => (
                    <Card key={user.id}>
                        <CardHeader>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                            <CardDescription>({user.kontak ? formatPhone(user.kontak) : '-'})</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium">Posisi:</p>
                            {user.positions?.length ? (
                                <ul className="list-inside list-disc space-y-1">
                                    {user.positions.map((pos) => (
                                        <li key={pos.id}>{pos.name}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>-</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="flex justify-end">
                <Button className="mt-4 w-fit rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700" asChild>
                    <Link href={route('team.index')} method="get">
                        Kembali
                    </Link>
                </Button>
            </div>
        </AppLayout>
    );
};

export default ShowTeam;
