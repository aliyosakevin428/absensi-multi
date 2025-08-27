import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Position } from '@/types';
import { useForm } from '@inertiajs/react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
    position?: Position;
    purpose: 'create' | 'edit';
};

const PositionFormSheet: FC<Props> = ({ children, purpose, position }) => {
    const [open, setOpen] = useState(false);
    const { data, setData, post, put } = useForm({
        name: position?.name ?? '',
    });

    const handleSubmit = () => {
        if (purpose === 'create') {
            post(route('position.store'), {
                onSuccess: () => {
                    toast.success('Posisi berhasil dibuat');
                    setOpen(false);
                }
            });
        } else {
            put(route('position.update', position?.id), {
                onSuccess: () => {
                    toast.success('Posisi berhasil diubah');
                    setOpen(false);
                }
            });
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="capitalize">{purpose} Your Position</SheetTitle>
                </SheetHeader>
                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama Posisi" />
                <p className="text-sm text-neutral-400">isi bagian ini untuk membuat posisi</p>

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

export default PositionFormSheet;
