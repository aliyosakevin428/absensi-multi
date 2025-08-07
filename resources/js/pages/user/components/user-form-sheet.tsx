import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Position, Team, User } from '@/types';
import { useForm } from '@inertiajs/react';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
    user?: User;
    teams?: Team[];
    positions?: Position[];
    purpose: 'create' | 'edit';
};

const UserFormSheet: FC<Props> = ({ children, purpose, user, teams, positions }) => {
    // const { permissions } = usePage<SharedData>().props;
    // const permits = permissions as string[];

    const { data, setData, post, put } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        team_id: user?.team?.id ?? '',
        position_ids: user?.positions.flatMap((p) => p.id) ?? [],
        // role: user?.role ?? '',
    });

    // if (!can(permits, 'user.create') || !can(permits, 'user.edit')) {
    //     return null;
    // }

    const handleSubmit = () => {
        if (purpose === 'create') {
            post(route('user.store'));
        } else {
            put(route('user.update', user?.id));
        }
    };

    return (
        <Sheet>
            <SheetTrigger>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="capitalize">{purpose} data user</SheetTitle>
                </SheetHeader>
                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Name" />
                <Input value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="Email" />
                <Input value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="Password" />
                <Select value={data.team_id.toString()} onValueChange={(value) => setData('team_id', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Team" />
                    </SelectTrigger>
                    <SelectContent>
                        {teams?.map((team) => (
                            <SelectItem key={team.id} value={team.id.toString()}>
                                {team.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={data.position_ids.toString()} onValueChange={(value) => setData('position_ids', [parseInt(value)])}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Posisi" />
                    </SelectTrigger>
                    <SelectContent>
                        {positions?.map((position) => (
                            <SelectItem key={position.id} value={position.id.toString()}>
                                {position.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                </Select> */}

                <SheetFooter>
                    <Button onClick={handleSubmit}>Simpan</Button>
                    <SheetClose asChild>
                        <Button>Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default UserFormSheet;
