import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination'; // komponen pagination yang sudah kita buat
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { AbsentReason, Attendance, Event, SharedData, User } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Edit, Folder, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AttendanceDeleteDialog from './components/attendance-delete-dialog';
import AttendanceFormSheet from './components/attendance-form-sheet';

const ListAttendance = ({
    attendances,
    users,
    events,
    absent,
}: {
    attendances: any; // ini paginated data
    users: User[];
    events: Event[];
    absent: AbsentReason[];
}) => {
    const [cari, setCari] = useState('');
    const { permissions } = usePage<SharedData>().props;

    const handlePageChange = (page: number) => {
        router.get(route('attendance.index'), { page, search: cari }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout
            title="Kehadiran Anggota"
            description="Daftar kehadiran anggota yang tersimpan dalam sistem"
            actions={
                permissions?.canAdd && (
                    <AttendanceFormSheet purpose="create" users={users} events={events} absent={absent}>
                        <Button>
                            <PlusCircle />
                            Buat Daftar Kehadiran
                        </Button>
                    </AttendanceFormSheet>
                )
            }
        >
            <div className="flex gap-4">
                <Input placeholder="Cari Kegiatan" value={cari} onChange={(e) => setCari(e.target.value)} className="w-full" />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Jumlah Anggota</TableHead>
                        <TableHead>Acara/Kegiatan</TableHead>
                        <TableHead>Tanggal Kegiatan</TableHead>
                        <TableHead>Status Kegiatan</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {attendances.data
                        .filter((attendance: Attendance) => JSON.stringify(attendance).toLowerCase().includes(cari.toLowerCase()))
                        .map((attendance: Attendance, index: number) => (
                            <TableRow key={attendance.id}>
                                <TableHead>{index + 1 + (attendances.current_page - 1) * attendances.per_page}</TableHead>
                                <TableHead>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Badge>{attendance.users?.length} Anggota</Badge>
                                        </PopoverTrigger>
                                        <PopoverContent align="center">{attendance.users?.map((user) => user.name).join(', ')}</PopoverContent>
                                    </Popover>
                                </TableHead>
                                <TableHead>{attendance.event?.name || 'N/A'}</TableHead>
                                <TableHead>{dayjs(attendance.event?.waktu_kegiatan).format('DD MMMM YYYY HH:mm')} WITA</TableHead>
                                <TableHead>{attendance.status || 'N/A'}</TableHead>
                                <TableHead>
                                    {permissions?.canShow && (
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={route('attendance.show', attendance.id)}>
                                                <Folder />
                                            </Link>
                                        </Button>
                                    )}
                                    {permissions?.canUpdate && (
                                        <AttendanceFormSheet purpose="edit" attendance={attendance} users={users} events={events} absent={absent}>
                                            <Button variant="ghost" size="icon">
                                                <Edit />
                                            </Button>
                                        </AttendanceFormSheet>
                                    )}
                                    {permissions?.canDelete && (
                                        <AttendanceDeleteDialog attendance={attendance}>
                                            <Button variant="ghost" size="icon">
                                                <Trash2 />
                                            </Button>
                                        </AttendanceDeleteDialog>
                                    )}
                                </TableHead>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <div className="mt-2 flex justify-end">
                <Pagination currentPage={attendances.current_page} lastPage={attendances.last_page} onPageChange={handlePageChange} />
            </div>
        </AppLayout>
    );
};

export default ListAttendance;
