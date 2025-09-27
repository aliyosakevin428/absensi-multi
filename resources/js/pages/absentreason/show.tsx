import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types';
import { FC } from 'react';

type Props = {
    absentReason: {
        id: number;
        name: string;
    };
    users: User[];
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
                        <ul className="text-foreground list-disc space-y-1 pl-5 text-sm">
                            {users.map((user) => (
                                <li key={user.id}>{user.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">Belum ada anggota yang pakai alasan ini.</p>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
};

export default ShowAbsentReason;
