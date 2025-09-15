import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Position, SharedData, Team, User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Edit, Folder, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import UserDeleteDialog from './components/user-delete-dialog';
import UserFormSheet from './components/user-form-sheet';

// type Props = {
//     users: User[];
//     teams: Team[];
//     positions: Position[];
// }
const ListUser = ({ users, positions, teams }: { users: User[]; teams: Team[]; positions: Position[] }) => {
    const [cari, setCari] = useState('');

    const { permissions } = usePage<SharedData>().props;

    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const formatPhone = (phone: string) => {
        const digits = phone.replace(/\D/g, ''); // hapus karakter non-digit
        if (digits.length === 12) return digits.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
        if (digits.length === 11) return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        return phone; // fallback jika panjang berbeda
    };

    console.log(users);
    return (
        <AppLayout
            title="Daftar Anggota"
            description="Daftar anggota yang terdaftar dalam sistem"
            actions={
                <>
                    {permissions?.canAdd && (
                        <UserFormSheet purpose="create">
                            <Button>
                                <PlusCircle />
                                Create new Team
                            </Button>
                        </UserFormSheet>
                    )}
                </>
            }
        >
            <div className="flex gap-4">
                <Input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari user" className="w-full" />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Kontak</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users
                        .filter((user) => user.name.includes(cari))
                        .map((user, index) => (
                            <TableRow key={user.id}>
                                <TableHead>{index + 1}</TableHead>
                                <TableHead>{user.name || 'N/A'}</TableHead>
                                <TableHead>{user.email || 'N/A'}</TableHead>
                                <TableHead>{user.kontak ? formatPhone(user.kontak) : 'N/A'}</TableHead>
                                <TableHead>{user.team?.name || 'N/A'}</TableHead>
                                <TableHead>{user.roles?.join(', ') || 'N/A'}</TableHead>
                                <TableHead>
                                    {user.positions && user.positions.length > 0 ? user.positions.map((p) => p.name).join(', ') : 'N/A'}
                                </TableHead>
                                <TableHead>
                                    {permissions?.canShow && (
                                        <Button variant={'ghost'} size={'icon'} asChild>
                                            <Link href={route('users.show', user.id)}>
                                                <Folder />
                                            </Link>
                                        </Button>
                                    )}
                                        {permissions?.canUpdate && (
                                            <>
                                            <UserFormSheet purpose="edit" user={user} positions={positions} teams={teams}>
                                                <Button variant={'ghost'} size={'icon'}>
                                                    <Edit />
                                                </Button>
                                            </UserFormSheet>
                                            </>
                                        )}
                                        {permissions?.canDelete && (
                                            <>
                                            <UserDeleteDialog user={user}>
                                                <Button variant={'ghost'} size={'icon'}>
                                                    <Trash2 />
                                                </Button>
                                            </UserDeleteDialog>
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

export default ListUser;
