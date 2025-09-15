import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { EventType, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Edit, Folder, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EventTypeDeleteDialog from './components/eventType-delete-dialog';
import EventTypeFormSheet from './components/eventType-form-sheet';

const ListEventType = ({ events = [] }: { events?: EventType[] }) => {
    const [cari, setCari] = useState('');

    const { permissions } = usePage<SharedData>().props;

    return (
        <AppLayout
            title="Jenis Acara"
            description="Daftar jenis acara yang tersedia dalam sistem"
            actions={
                permissions?.canAdd && (
                    <EventTypeFormSheet purpose="create">
                        <Button>
                            <PlusCircle />
                            Create new Team
                        </Button>
                    </EventTypeFormSheet>
                )
            }
        >
            <div className="flex gap-4">
                <Input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari acara" className="w-full" />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Actions</TableHead>
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
                                    {permissions?.canShow && (
                                        <Button variant={'ghost'} size={'icon'} asChild>
                                            <Link href={route('event-type.show', event.id)}>
                                                <Folder />
                                            </Link>
                                        </Button>
                                    )}
                                    {permissions?.canUpdate && (
                                        <>
                                            <Button variant={'ghost'} size={'icon'} asChild>
                                                <Link href={route('event-type.update', event.id)}>
                                                    <Edit />
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                    {permissions?.canDelete && (
                                        <>
                                            <EventTypeDeleteDialog event_type={event}>
                                                <Button variant={'ghost'} size={'icon'}>
                                                    <Trash2 />
                                                </Button>
                                            </EventTypeDeleteDialog>
                                        </>
                                    )}
                                </TableHead>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </AppLayout>
    );
};

export default ListEventType;
