import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Position, Team, User } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { FC } from 'react';
import { toast } from 'sonner';

type Props = {
    user: User;
    teams: Team[];
    positions: Position[];
};

const ShowUser: FC<Props> = ({ user, teams, positions }) => {
    // State form pakai inertia useForm
    const { data, setData, put, processing, errors } = useForm({
        position_ids: user.positions?.map((p) => p.id) || [],
        team_id: user.team?.id || null,
    });

    // Toggle posisi pakai checkbox
    const togglePosition = (posId: number) => {
        if (data.position_ids.includes(posId)) {
            setData(
                'position_ids',
                data.position_ids.filter((id) => id !== posId),
            );
        } else {
            setData('position_ids', [...data.position_ids, posId]);
        }
    };

    // Pilih tim
    const handleTeamChange = (teamId: number) => {
        setData('team_id', teamId);
    };

    const handleSave = () => {
        put(route('users.updatePositionsAndTeam', user.id), {
            preserveScroll: true,
            onError: () => {
                toast.error('Gagal menyimpan perubahan');
            },
        });
    };

    return (
        <AppLayout title="Detail User" description="Detail data user beserta posisi & tim">
            {/* Card Utama User */}
            <Card>
                <CardHeader>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-blue-600">Kontak: {user.kontak ?? '-'}</p>
                </CardContent>
            </Card>

            {/* Card List Posisi */}
            <div className="mt-6">
                <h2 className="mb-3 text-lg font-semibold">Posisi</h2>
                {positions?.length ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {positions.map((pos) => (
                            <Card key={pos.id} className="flex items-center">
                                <CardContent className="flex w-full items-center gap-3 p-4">
                                    <input
                                        type="checkbox"
                                        checked={data.position_ids.includes(pos.id)}
                                        onChange={() => togglePosition(pos.id)}
                                        className="h-4 w-4 accent-blue-500"
                                    />
                                    <span className="text-sm font-medium">{pos.name}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">Belum ada posisi</p>
                )}
                {errors.position_ids && <p className="text-sm text-red-500">{errors.position_ids}</p>}
            </div>

            {/* Card List Team */}
            <div className="mt-6">
                <h2 className="mb-3 text-lg font-semibold">Pilih Tim</h2>
                {teams?.length ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {teams.map((team) => (
                            <Card
                                key={team.id}
                                className={`cursor-pointer border ${data.team_id === team.id ? 'border-blue-500' : 'border-gray-200'}`}
                                onClick={() => handleTeamChange(team.id)}
                            >
                                <CardContent className="flex w-full items-center gap-3 p-4">
                                    <input
                                        type="radio"
                                        name="team"
                                        checked={data.team_id === team.id}
                                        onChange={() => handleTeamChange(team.id)}
                                        className="h-4 w-4 accent-blue-500"
                                    />
                                    <span className="text-sm font-medium">{team.name}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">Belum ada tim</p>
                )}
                {errors.team_id && <p className="text-sm text-red-500">{errors.team_id}</p>}
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 flex justify-end gap-3">
                <Button onClick={handleSave} disabled={processing} className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-700">
                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
                <Button className="rounded-md bg-red-500 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700" asChild>
                    <Link href={route('users.index')} method="get">
                        Kembali
                    </Link>
                </Button>
            </div>
        </AppLayout>
    );
};

export default ShowUser;
