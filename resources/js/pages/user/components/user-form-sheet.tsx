import FormControl from '@/components/form-control';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MultipleSelector from '@/components/ui/multiple-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Position, Role, Team, User } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
    user?: User;
    teams?: Team[];
    positions?: Position[];
    purpose: 'create' | 'edit';
};

const UserFormSheet: FC<Props> = ({ children, purpose, user, teams, positions }) => {
    const { roles } = usePage<{ roles: Role[] }>().props;
    // const permits = roles as string[];
    const [sheetOpen, setSheetOpen] = useState(false);

    const { data, setData, post, put, processing } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        kontak: user?.kontak ?? '',
        team_id: user?.team?.id ?? '',
        position_ids: user?.positions?.map((p) => p.id) ?? [], // array of numbers
        roles: user?.roles ?? [],
    });

    // if (!can(permits, 'user.create') || !can(permits, 'user.edit')) {
    //     return null;
    // }

    const resetForm = () => {
        if (purpose === 'create') {
            setData({
                name: '',
                email: '',
                password: '',
                kontak: '',
                team_id: '',
                position_ids: [],
                roles: [],
            });
        } else if (user) {
            setData({
                name: user.name,
                email: user.email,
                password: '',
                kontak: user.kontak,
                team_id: user.team?.id ?? '',
                position_ids: user.positions?.map((p) => p.id) ?? [],
                roles: user.roles ?? [],
            });
        }
    };
    console.log(data);

    const handleSubmit = () => {
        if (purpose === 'create') {
            post(route('users.store'), {
                onSuccess: () => toast.success('Anggota Berhasil Ditambahkan'),
                onFinish: () => setSheetOpen(false),
            });
        } else {
            put(route('users.update', user?.id), {
                onSuccess: () => toast.success('Anggota Berhasil Diubah'),
                onFinish: () => setSheetOpen(false),
            });
        }
    };

    return (
        <Sheet
            open={sheetOpen}
            onOpenChange={(open) => {
                setSheetOpen(open);
                if (open) resetForm(); // reset form saat sheet dibuka
            }}
        >
            <SheetTrigger>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="capitalize">{purpose} data user</SheetTitle>
                </SheetHeader>
                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Name" />
                <Input value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="Email" />
                <Input value={data.kontak} onChange={(e) => setData('kontak', e.target.value)} placeholder="Kontak" />
                <Input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder={purpose === 'create' ? 'Masukkan password' : 'Kosongkan jika ingin memakai password lama'}
                />
                <Select value={data.team_id ? data.team_id.toString() : ''} onValueChange={(v) => setData('team_id', parseInt(v))}>
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
                <MultipleSelector
                    options={positions?.map((p) => ({ label: p.name, value: p.id.toString() })) ?? []}
                    value={
                        positions?.filter((p) => data.position_ids.includes(Number(p.id))).map((p) => ({ label: p.name, value: p.id.toString() })) ??
                        []
                    }
                    onChange={(values) =>
                        setData(
                            'position_ids',
                            values.map((v) => parseInt(v.value)), // array of numbers
                        )
                    }
                    placeholder="Pilih Posisi"
                />
                <FormControl label="Select role: ">
                    <div className="grid">
                        {roles.map((roleObj) => (
                            <Label key={roleObj.id} className="flex h-8 items-center gap-2">
                                <Checkbox
                                    checked={data.roles?.includes(roleObj.name)}
                                    onCheckedChange={(c) =>
                                        setData('roles', c ? [...data.roles, roleObj.name] : data.roles.filter((role) => role !== roleObj.name))
                                    }
                                />
                                {roleObj.name}
                            </Label>
                        ))}
                    </div>
                </FormControl>
                <SheetFooter>
                    <Button onClick={handleSubmit} type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                    <SheetClose asChild>
                        <Button>Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default UserFormSheet;
