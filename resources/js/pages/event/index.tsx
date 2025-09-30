import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Event, EventType, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Edit, Folder, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EventDeleteDialog from './components/event-delete-dialog';
import EventFormSheet from './components/event-form-sheet';

const ListEvent = ({ eventses }: { eventses: Event[]; event_types: EventType[] }) => {
    const [cari, setCari] = useState('');

    const { permissions } = usePage<SharedData>().props;

    return (
        <AppLayout
            title="Acara"
            description="Daftar acara yang terdaftar dalam sistem"
            actions={
                <>
                    {permissions?.canAdd && (
                        <EventFormSheet purpose="create">
                            <Button>
                                <PlusCircle />
                                Tambah Acara
                            </Button>
                        </EventFormSheet>
                    )}
                </>
            }
        >
            <div className="flex gap-4">
                <Input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari Kegiatan" className="w-full" />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Kegiatan</TableHead>
                        <TableHead>Tanggal Kegiatan</TableHead>
                        <TableHead>Lokasi Kegiatan</TableHead>
                        <TableHead>Jenis Kegiatan</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* {(console.log('Events data:', eventses), '')} */}
                    {eventses
                        .filter((events) => events.name.includes(cari))
                        .map((events, index) => (
                            <TableRow key={events.id}>
                                <TableHead>{index + 1}</TableHead>
                                <TableHead>{events.name}</TableHead>
                                <TableHead>{dayjs(events.waktu_kegiatan).format('DD MMMM YYYY HH:mm')} WITA</TableHead>
                                <TableHead>{events.lokasi_kegiatan}</TableHead>
                                <TableHead>{events.event_types?.name}</TableHead>
                                <TableHead>
                                    {permissions?.canShow && (
                                        <Button variant={'ghost'} size={'icon'} asChild>
                                            <Link href={route('event.show', events.id)}>
                                                <Folder />
                                            </Link>
                                        </Button>
                                    )}
                                    {permissions?.canUpdate && (
                                        <>
                                            <EventFormSheet purpose="edit" event={events}>
                                                <Button variant={'ghost'} size={'icon'}>
                                                    <Edit />
                                                </Button>
                                            </EventFormSheet>
                                        </>
                                    )}
                                    {permissions?.canDelete && (
                                        <>
                                            <EventDeleteDialog event={events}>
                                                <Button variant={'ghost'} size={'icon'}>
                                                    <Trash2 />
                                                </Button>
                                            </EventDeleteDialog>
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

export default ListEvent;
