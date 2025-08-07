import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AbsentReason } from '@/types';
import { useForm } from '@inertiajs/react';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
    absent?: AbsentReason;
    purpose: 'create' | 'edit';
};

const UserFormSheet: FC<Props> = ({ children, purpose, absent }) => {
    // const { permissions } = usePage<SharedData>().props;
    // const permits = permissions as string[];

    const { data, setData, post, put } = useForm({
        name: absent?.name ?? '',
    });

    // if (!can(permits, 'user.create') || !can(permits, 'user.edit')) {
    //     return null;
    // }

    const handleSubmit = () => {
        if (purpose === 'create') {
            post(route('absent-reason.store'));
        } else {
            put(route('absent-reason.update', absent?.id));
        }
    };

    return (
        <Sheet>
            <SheetTrigger>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="capitalize">{purpose} Your Absent Reason</SheetTitle>
                </SheetHeader>
                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Name" />
                <p className="p-2 text-sm text-neutral-400">isi bagian ini untuk membuat alasan absen</p>
                {/* <Input value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="Email" />
                <Input value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="Password" /> */}

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
