import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { AbsentReason } from '@/types';
import { Link } from '@inertiajs/react';
import { Edit, Folder, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AbsentReasonFormSheet from './components/absentreason-form-sheet';
import AbsentReasonDeleteDialog from './components/absentreason-delete-dialog';

const ListAbsentReason = ({ absentreasons }: { absentreasons: AbsentReason[] }) => {
    const [cari, setCari] = useState('');
    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Settings',
                    href: '/',
                },
                {
                    title: 'Absent Reason',
                    href: route('absent-reason.index'),
                },
            ]}
            title="Halaman Alasan Kehadiran"
            description="Halaman Alasan Kehadiran untuk absensi anggota multimedia"
        >
            <div className="flex gap-4">
                <Input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari absent" className="w-full" />
                <AbsentReasonFormSheet purpose="create">
                    <Button>Create new Absent</Button>
                </AbsentReasonFormSheet>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Name</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {absentreasons
                        .filter((absent) => absent.name.includes(cari))
                        .map((absent, index) => (
                            <TableRow key={absent.id}>
                                <TableHead>{index + 1}</TableHead>
                                <TableHead>{absent.name}</TableHead>
                                <TableHead>
                                    <Button variant={'ghost'} size={'icon'} asChild>
                                        <Link href={route('absent-reason.show', absent.id)}>
                                            <Folder />
                                        </Link>
                                    </Button>
                                    <AbsentReasonFormSheet purpose="edit" absent={absent}>
                                        <Button variant={'ghost'} size={'icon'}>
                                            <Edit />
                                        </Button>
                                    </AbsentReasonFormSheet>
                                    <AbsentReasonDeleteDialog absent_reason={absent}>
                                        <Button variant={'ghost'} size={'icon'}>
                                            <Trash2 />
                                        </Button>
                                    </AbsentReasonDeleteDialog>
                                </TableHead>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </AppLayout>
    );
};

export default ListAbsentReason;
