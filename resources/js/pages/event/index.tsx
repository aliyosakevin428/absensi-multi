import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { strLimit } from '@/lib/utils';
import { Event, EventType, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Edit, Folder, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EventDeleteDialog from './components/event-delete-dialog';
import EventFormSheet from './components/event-form-sheet';
import { Pagination } from '@/components/ui/pagination';

type Props = {
    eventses: {
        data: Event[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    event_types: EventType[];
};

const ListEvent = ({ eventses }: Props) => {
    const [cari, setCari] = useState('');
    const { permissions, auth } = usePage<SharedData>().props;

    const roles = auth.user?.roles ?? [];
    const isAdmin = roles.some((role) => ['Admin', 'Superadmin'].includes(role.name));

    // Filter event by search
    const filteredEvents = eventses.data.filter((events) => JSON.stringify(events).toLowerCase().includes(cari.toLowerCase()));

    const handlePageChange = (page: number) => {
        router.get(route('event.index'), { page, search: cari }, { preserveState: true });
    };

    const startNumber = (eventses.current_page - 1) * eventses.per_page;

    return (
        <AppLayout
            title="Acara"
            description="Daftar acara yang terdaftar dalam sistem"
            actions={
                <>
                    {permissions?.canAdd && (
                        <EventFormSheet purpose="create">
                            <Button>
                                <PlusCircle /> Tambah Acara
                            </Button>
                        </EventFormSheet>
                    )}
                </>
            }
        >
            <div className="mb-4 flex gap-4">
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
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredEvents.map((events, index) => (
                        <TableRow key={events.id}>
                            <TableHead>{startNumber + index + 1}</TableHead>
                            <TableHead>{strLimit(events.name)}</TableHead>
                            <TableHead>{dayjs(events.waktu_kegiatan).format('DD MMMM YYYY HH:mm')}</TableHead>
                            <TableHead>{events.lokasi_kegiatan}</TableHead>
                            <TableHead>{events.event_types?.name ?? '-'}</TableHead>
                            <TableHead>
                                {isAdmin ? (
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={events.is_active}
                                            onCheckedChange={(checked) =>
                                                router.patch(route('event.toggle', events.id), { is_active: checked }, { preserveScroll: true })
                                            }
                                        />
                                        <span className={`text-xs font-medium ${events.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                                            {events.is_active ? 'Aktif' : 'Tidak Aktif'}
                                        </span>
                                    </div>
                                ) : (
                                    <span className={`text-sm font-medium ${events.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                                        {events.is_active ? 'Aktif' : 'Tidak Aktif'}
                                    </span>
                                )}
                            </TableHead>
                            <TableHead>
                                {permissions?.canShow && (
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={route('event.show', events.id)}>
                                            <Folder />
                                        </Link>
                                    </Button>
                                )}
                                {permissions?.canUpdate && (
                                    <EventFormSheet purpose="edit" event={events}>
                                        <Button variant="ghost" size="icon">
                                            <Edit />
                                        </Button>
                                    </EventFormSheet>
                                )}
                                {permissions?.canDelete && (
                                    <EventDeleteDialog event={events}>
                                        <Button variant="ghost" size="icon">
                                            <Trash2 />
                                        </Button>
                                    </EventDeleteDialog>
                                )}
                            </TableHead>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="mt-2 flex justify-end">
                <Pagination currentPage={eventses.current_page} lastPage={eventses.last_page} onPageChange={(page) => handlePageChange(page)} />
            </div>
        </AppLayout>
    );
};

export default ListEvent;
