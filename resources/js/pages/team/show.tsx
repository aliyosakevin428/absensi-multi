import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Team, User } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Mail, Phone, Shield, Users } from 'lucide-react';
import { FC } from 'react';

type Props = {
    team: Team;
};

const ShowTeam: FC<Props> = ({ team }) => {
    const formatPhone = (phone: string) => {
        const digits = phone.replace(/\D/g, '');

        if (digits.length === 12) {
            return digits.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
        }

        if (digits.length === 11) {
            return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }

        return phone;
    };

    const members = team.users ?? [];

    return (
        <AppLayout
            title="Detail Team"
            description={`Informasi team ${team.name} beserta anggota yang terdaftar.`}
            actions={
                <Link href={route('team.index')}>
                    <Button variant="outline">
                        <ArrowLeft />
                        Kembali
                    </Button>
                </Link>
            }
        >
            <Card className="overflow-hidden">
                <CardHeader className="border-b bg-muted/20 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Users className="size-6" />
                            </div>

                            <div>
                                <CardTitle className="text-xl">{team.name}</CardTitle>

                                <CardDescription className="mt-1">Daftar anggota yang terdaftar dalam team ini.</CardDescription>
                            </div>
                        </div>

                        <div className="flex w-fit items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm font-medium">
                            <Users className="size-4 text-primary" />

                            <span>
                                {members.length} {members.length === 1 ? 'Anggota' : 'Anggota'}
                            </span>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="mt-6">
                <div className="mb-4 flex items-center justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                    <div>
                        <h2 className="text-lg font-semibold">Anggota Team</h2>

                        <p className="text-sm text-muted-foreground">Daftar pengguna yang menjadi anggota team ini.</p>
                    </div>
                </div>

                {members.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {members.map((user: User) => (
                            <Card key={user.id} className="overflow-hidden transition-shadow hover:shadow-md">
                                <CardHeader className="border-b bg-muted/20 p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="size-11 shrink-0 overflow-hidden rounded-full bg-primary/10">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={`Foto profil ${user.name}`} className="size-full object-cover" />
                                            ) : (
                                                <div className="flex size-full items-center justify-center text-sm font-semibold text-primary">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <CardTitle className="truncate text-base">{user.name}</CardTitle>

                                            <CardDescription className="mt-1 truncate">{user.email}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4 p-5">
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                                <Mail className="size-4 text-muted-foreground" />
                                            </div>

                                            <span className="truncate text-muted-foreground">{user.email}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                                <Phone className="size-4 text-muted-foreground" />
                                            </div>

                                            <span className="text-muted-foreground">
                                                {user.kontak ? formatPhone(user.kontak) : 'Nomor kontak belum tersedia'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="mb-2 flex items-center gap-2">
                                            <Shield className="size-4 text-primary" />

                                            <p className="text-sm font-medium">Posisi</p>
                                        </div>

                                        {user.positions?.length ? (
                                            <div className="flex flex-wrap gap-2">
                                                {user.positions.map((position) => (
                                                    <span
                                                        key={position.id}
                                                        className="rounded-full border bg-muted/50 px-2.5 py-1 text-xs font-medium"
                                                    >
                                                        {position.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Belum memiliki posisi</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                                <Users className="size-6 text-muted-foreground" />
                            </div>

                            <h3 className="text-sm font-semibold">Belum ada anggota</h3>

                            <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                Belum ada pengguna yang terdaftar sebagai anggota dalam team ini.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
};

export default ShowTeam;
