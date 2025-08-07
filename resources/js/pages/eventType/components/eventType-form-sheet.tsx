import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { EventType } from '@/types';
import { useForm } from '@inertiajs/react';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
    eventType?: EventType;
    purpose: 'create' | 'edit';
};

const EventTypeFormSheet: FC<Props> = ({ children, purpose, eventType }) => {
    const { data, setData, post, put } = useForm({
        name: eventType?.name ?? '',
    });

    const handleSubmit = () => {
        if (purpose === 'create') {
            post(route('event-type.store'));
        } else {
            put(route('event-type.update', eventType?.id));
        }
    };

    return (
        <Sheet>
            <SheetTrigger>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="capitalize">{purpose} Your Team</SheetTitle>
                </SheetHeader>
                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Name" />
                <p className="text-sm text-neutral-400">isi bagian ini untuk membuat jenis acara </p>

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

export default EventTypeFormSheet;
