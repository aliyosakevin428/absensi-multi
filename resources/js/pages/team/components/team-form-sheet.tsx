import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Team } from '@/types';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
    team?: Team;
    purpose: 'create' | 'edit';
};

const TeamFormSheet: FC<Props> = ({ children, purpose, team }) => {
    const [open, setSheetOpen] = useState(false);
    const { data, setData, post, put } = useForm({
        name: team?.name ?? '',
    });

    const handleSubmit = () => {
        if (purpose === 'create') {
            post(route('team.store'), {
                onSuccess: () => toast.success('Team Berhasil Ditambahkan'),
                onFinish: () => setSheetOpen(false),
            });
        } else {
            put(route('team.update', team?.id), {
                onSuccess: () => toast.success('Team Berhasil Diubah'),
                onFinish: () => setSheetOpen(false),
            });
        }
    };

    return (
        <Sheet open={open} onOpenChange={setSheetOpen}>
            <SheetTrigger>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="capitalize">{purpose} Your Team</SheetTitle>
                </SheetHeader>
                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Name" />

                <SheetFooter>
                    <Button onClick={handleSubmit}>Simpan</Button>
                    <SheetClose asChild>
                        <Button variant={'outline'}>
                            <X />
                            Close
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default TeamFormSheet;
