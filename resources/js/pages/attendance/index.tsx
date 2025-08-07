import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { AbsentReason, Attendance, Event, User } from '@/types';
import { Link } from '@inertiajs/react';
import { Folder, Trash2 } from 'lucide-react';
import { useState } from 'react';

const ListAttendance = ({ attendances }: { attendances: Attendance[]; users: User[]; event: Event[]; absent: AbsentReason[] }) => {
    const [cari, setCari] = useState('');

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Kehadiran Anggota',
                    href: route('attendance.index'),
                },
            ]}
        >
            <div className="flex gap-4">
                <Input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari Kegiatan" className="w-full" />
                {/* <UserFormSheet purpose="create">
                    <Button>Create new user</Button>
                </UserFormSheet> */}
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Anggota</TableHead>
                        <TableHead>Acara/Kegiatan</TableHead>
                        <TableHead>Status Kegiatan</TableHead>
                        <TableHead>Jenis Kehadiran</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {attendances
                        .filter((attendance) => attendance.status.includes(cari))
                        .map((attendance, index) => (
                            <TableRow key={attendance.id}>
                                <TableHead>{index + 1}</TableHead>
                                {/* <TableHead>{attendance.users.length} hadir</TableHead> */}
                                <TableHead>{attendance.users?.map((user) => user.name).join(', ') || 'N/A'}</TableHead>
                                <TableHead>{attendance.event?.name || 'N/A'}</TableHead>
                                <TableHead>{attendance.status || 'N/A'}</TableHead>
                                <TableHead>{attendance.absent_reason?.name || 'N/A'}</TableHead>
                                <TableHead>
                                    <Button variant={'ghost'} size={'icon'} asChild>
                                        <Link href={route('attendance.show', attendance.id)}>
                                            <Folder />
                                        </Link>
                                    </Button>
                                    {/* <UserFormSheet purpose="edit" user={user}>
                                        <Button variant={'ghost'} size={'icon'}>
                                            <Edit />
                                        </Button>
                                    </UserFormSheet> */}
                                    <Button variant={'ghost'} size={'icon'} asChild>
                                        <Link href={route('attendance.destroy', attendance.id)} method="delete">
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

export default ListAttendance;
