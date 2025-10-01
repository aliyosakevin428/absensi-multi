import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { EventType } from '@/types';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
    eventType?: EventType;
    purpose: 'create' | 'edit';
};

const EventTypeFormSheet: FC<Props> = ({ children, purpose, eventType }) => {
    const [open, setSheetOpen] = useState(false);
    const { data, setData, post, put, processing } = useForm({
        name: eventType?.name ?? '',
    });

    const handleSubmit = () => {
        if (purpose === 'create') {
            post(route('event-type.store'), {
                onSuccess: () => toast.success('Jenis Acara Berhasil Ditambahkan'),
                onFinish: () => setSheetOpen(false),
            });
        } else {
            put(route('event-type.update', eventType?.id), {
                onSuccess: () => toast.success('Jenis Acara Berhasil Diubah'),
                onFinish: () => setSheetOpen(false),
            });
        }
    };

    return (
        <Sheet open={open} onOpenChange={setSheetOpen}>
            <SheetTrigger>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="capitalize">{purpose} Event Type</SheetTitle>
                </SheetHeader>
                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Name" />
                <p className="text-sm text-neutral-400">isi bagian ini untuk membuat jenis acara </p>

                <SheetFooter>
                    <Button onClick={handleSubmit} type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
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

export default EventTypeFormSheet;
