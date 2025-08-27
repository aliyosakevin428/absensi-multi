import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { AbsentReason, Attendance, Event, User } from '@/types';
import { Link } from '@inertiajs/react';
import { Edit, Folder, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AttendanceDeleteDialog from './components/attendance-delete-dialog';
import AttendanceFormSheet from './components/attendance-form-sheet';

const ListAttendance = ({
    attendances,
    users,
    events,
    absent,
}: {
    attendances: Attendance[];
    users: User[];
    events: Event[];
    absent: AbsentReason[];
}) => {
    const [cari, setCari] = useState('');

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Kehadiran Anggota',
                    href: route('attendance.index'),
                },
            ]}
            title="Kehadiran Anggota"
            description="Daftar kehadiran anggota"
        >
            <div className="flex gap-4">
                <Input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari Kegiatan" className="w-full" />
                <AttendanceFormSheet purpose="create" users={users} events={events} absent={absent}>
                    <Button>Create new Attendance</Button>
                </AttendanceFormSheet>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Jumlah Anggota</TableHead>
                        <TableHead>Acara/Kegiatan</TableHead>
                        <TableHead>Jenis Kehadiran</TableHead>
                        <TableHead>Status Kegiatan</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {attendances
                        .filter((attendance) => attendance.status.includes(cari))
                        .map((attendance, index) => (
                            <TableRow key={attendance.id}>
                                <TableHead>{index + 1}</TableHead>
                                <TableHead>{attendance.users.length} Anggota</TableHead>
                                {/* <TableHead>{attendance.users?.map((user) => user.name).join(', ') || 'N/A'}</TableHead> */}
                                <TableHead>{attendance.event?.name || 'N/A'}</TableHead>
                                <TableHead>{attendance.absent_reason?.name || 'N/A'}</TableHead>
                                <TableHead>{attendance.status || 'N/A'}</TableHead>
                                <TableHead>
                                    <Button variant={'ghost'} size={'icon'} asChild>
                                        <Link href={route('attendance.show', attendance.id)}>
                                            <Folder />
                                        </Link>
                                    </Button>
                                    <AttendanceFormSheet purpose="edit" attendance={attendance} users={users} events={events} absent={absent}>
                                        <Button variant={'ghost'} size={'icon'}>
                                            <Edit />
                                        </Button>
                                    </AttendanceFormSheet>
                                    <AttendanceDeleteDialog attendance={attendance}>
                                        <Button variant={'ghost'} size={'icon'}>
                                            <Trash2 />
                                        </Button>
                                    </AttendanceDeleteDialog>
                                </TableHead>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </AppLayout>
    );
};

export default ListAttendance;
