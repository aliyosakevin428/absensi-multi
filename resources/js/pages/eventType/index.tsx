import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { EventType } from '@/types';
import { Link } from '@inertiajs/react';
import { Edit, Folder, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EventTypeFormSheet from './components/eventType-form-sheet';
import EventTypeDeleteDialog from './components/eventType-delete-dialog';

const ListEventType = ({ events = [] }: { events?: EventType[] }) => {
    const [cari, setCari] = useState('');
    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Settings',
                    href: '/',
                },
                {
                    title: 'Tipe Acara',
                    href: route('event-type.index'),
                },
            ]}
            title="Tipe Acara"
            description="Daftar tipe acara"
        >
            <div className="flex gap-4">
                <Input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari acara" className="w-full" />
                <EventTypeFormSheet purpose="create">
                    <Button>Buat Jenis Acara Baru</Button>
                </EventTypeFormSheet>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Name</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* {(console.log('Events data:', events), '')} */}
                    {events
                        .filter((event) => event.name.includes(cari))
                        .map((event, index) => (
                            <TableRow key={event.id}>
                                <TableHead>{index + 1}</TableHead>
                                <TableHead>{event.name}</TableHead>
                                <TableHead>
                                    <Button variant={'ghost'} size={'icon'} asChild>
                                        <Link href={route('event-type.show', event.id)}>
                                            <Folder />
                                        </Link>
                                    </Button>
                                    <EventTypeFormSheet purpose="edit" eventType={event}>
                                        <Button variant={'ghost'} size={'icon'}>
                                            <Edit />
                                        </Button>
                                    </EventTypeFormSheet>
                                    <EventTypeDeleteDialog event_type={event}>
                                        <Button variant={'ghost'} size={'icon'}>
                                            <Trash2 />
                                        </Button>
                                    </EventTypeDeleteDialog>
                                </TableHead>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </AppLayout>
    );
};

export default ListEventType;
