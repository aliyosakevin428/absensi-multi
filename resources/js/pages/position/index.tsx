import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Position } from '@/types';
import { Link } from '@inertiajs/react';
import { Edit2, Folder, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
                    title: 'User',
                    href: route('user.index'),
                },
            ]}
        >
            <div className="flex gap-4">
                <Input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari posisi" className="w-full" />
                <PositionFormSheet purpose="create">
                    <Button>Buat Posisi Baru</Button>
                </PositionFormSheet>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Name</TableHead>
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
                                            <Edit2 />
                                        </Button>
                                    </PositionFormSheet>
                                    <Button variant={'ghost'} size={'icon'} asChild>
                                        <Link href={route('position.destroy', position.id)} method="delete">
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

export default ListPosition;
