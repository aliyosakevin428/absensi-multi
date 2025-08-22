import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Event, EventType } from '@/types';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Edit, Folder, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EventFormSheet from './components/event-form-sheet';

const ListEvent = ({ eventses }: { eventses: Event[]; event_types: EventType[] }) => {
    const [cari, setCari] = useState('');
    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Acara',
                    href: route('event.index'),
                },
            ]}
        >
            <div className="flex gap-4">
                <Input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari Kegiatan" className="w-full" />
                <EventFormSheet purpose="create">
                    <Button>Buat Acara Baru</Button>
                </EventFormSheet>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Kegiatan</TableHead>
                        <TableHead>Tanggal Kegiatan</TableHead>
                        <TableHead>Lokasi Kegiatan</TableHead>
                        <TableHead>Jenis Kegiatan</TableHead>
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
                                    <Button variant={'ghost'} size={'icon'} asChild>
                                        <Link href={route('event.show', events.id)}>
                                            <Folder />
                                        </Link>
                                    </Button>
                                    <EventFormSheet purpose="edit" event={events}>
                                        <Button variant={'ghost'} size={'icon'}>
                                            <Edit />
                                        </Button>
                                    </EventFormSheet>
                                    <Button variant={'ghost'} size={'icon'} asChild>
                                        <Link href={route('event.destroy', events.id)} method="delete">
                                            <Trash2 />
                                        </Link>
                                    </Button>
                                </TableHead>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </AppLayout>
    );
};

export default ListEvent;
