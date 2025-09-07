import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Position } from '@/types';
import { Link } from '@inertiajs/react';
import { Edit, Folder, Trash2 } from 'lucide-react';
import { useState } from 'react';
import PositionDeleteDialog from './components/position-delete-dialog';
import PositionFormSheet from './components/position-form-sheet';

const ListPosition = ({ positions }: { positions: Position[] }) => {
    const [cari, setCari] = useState('');
    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Settings',
                    href: '/',
                },
                {
                    title: 'Position',
                    href: route('position.index'),
                },
            ]}
            title="Position Settings"
            description="Daftar Posisi yang terdaftar dalam sistem"
        >
            <div className="flex gap-4">
                <Input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari posisi" className="w-full" />
                <PositionFormSheet purpose="create">
                    <Button className="bg-blue-600 text-white hover:bg-blue-900">Buat Posisi Baru</Button>
                </PositionFormSheet>
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
                    {positions
                        .filter((position) => position.name.includes(cari))
                        .map((position, index) => (
                            <TableRow key={position.id}>
                                <TableHead>{index + 1}</TableHead>
                                <TableHead>{position.name}</TableHead>
                                <TableHead>
                                    <Button variant={'ghost'} size={'icon'} asChild>
                                        <Link href={route('position.show', position.id)}>
                                            <Folder />
                                        </Link>
                                    </Button>
                                    <PositionFormSheet purpose="edit" position={position}>
                                        <Button variant={'ghost'} size={'icon'}>
                                            <Edit />
                                        </Button>
                                    </PositionFormSheet>
                                    <PositionDeleteDialog position={position}>
                                        <Button variant={'ghost'} size={'icon'}>
                                            <Trash2 />
                                        </Button>
                                    </PositionDeleteDialog>
                                </TableHead>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </AppLayout>
    );
};

export default ListPosition;
