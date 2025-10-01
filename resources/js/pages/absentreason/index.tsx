import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { AbsentReason, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Edit, Folder, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AbsentReasonDeleteDialog from './components/absentreason-delete-dialog';
import AbsentReasonFormSheet from './components/absentreason-form-sheet';

const ListAbsentReason = ({ absentreasons }: { absentreasons: AbsentReason[] }) => {
    const [cari, setCari] = useState('');

    const { permissions } = usePage<SharedData>().props;
    return (
        <AppLayout
            title="Keterangan Kehadiran"
            description="Halaman Alasan Kehadiran untuk absensi anggota multimedia"
            actions={
                <>
                    {permissions?.canAdd && (
                        <AbsentReasonFormSheet purpose="create">
                            <Button>
                                <PlusCircle />
                                Buat Alasan Kehadiran Baru
                            </Button>
                        </AbsentReasonFormSheet>
                    )}
                </>
            }
        >
            <div className="flex gap-4">
                <Input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari absent" className="w-full" />
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
                    {absentreasons
                        .filter((absent) => absent.name.includes(cari))
                        .map((absent, index) => (
                            <TableRow key={absent.id}>
                                <TableHead>{index + 1}</TableHead>
                                <TableHead>{absent.name}</TableHead>
                                <TableHead>
                                    {permissions?.canShow && (
                                        <Button variant={'ghost'} size={'icon'} asChild>
                                            <Link href={route('absent-reason.show', absent.id)}>
                                                <Folder />
                                            </Link>
                                        </Button>
                                    )}
                                    {permissions?.canUpdate && (
                                        <>
                                            <AbsentReasonFormSheet purpose="edit" absent={absent}>
                                                <Button variant={'ghost'} size={'icon'}>
                                                    <Edit />
                                                </Button>
                                            </AbsentReasonFormSheet>
                                        </>
                                    )}
                                    {permissions?.canDelete && (
                                        <>
                                            <AbsentReasonDeleteDialog absent_reason={absent}>
                                                <Button variant={'ghost'} size={'icon'}>
                                                    <Trash2 />
                                                </Button>
                                            </AbsentReasonDeleteDialog>
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

export default ListAbsentReason;
