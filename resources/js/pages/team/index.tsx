import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { SharedData, Team } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Edit, Folder, PlusCircle, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import TeamDeleteDialog from './components/team-delete-dialog';
import TeamFormSheet from './components/team-form-sheet';

type Props = {
    teams: Team[];
    // query: { [key: string]: string };
};
const ListTeam: FC<Props> = ({ teams }) => {
    const [cari, setCari] = useState('');

    const { permissions } = usePage<SharedData>().props;

    return (
        <AppLayout
            title="Team Settings"
            description="Daftar tim yang terdaftar dalam sistem"
            actions={
                <>
                    {permissions?.canAdd && (
                        <TeamFormSheet purpose="create">
                            <Button>
                                <PlusCircle />
                                Buat Tim Baru
                            </Button>
                        </TeamFormSheet>
                    )}
                </>
            }
        >
            <div className="flex gap-4">
                <Input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari tim" className="w-full" />
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
                    {teams
                        .filter((team) => team.name.includes(cari))
                        .map((team, index) => (
                            <TableRow key={team.id}>
                                <TableHead>{index + 1}</TableHead>
                                <TableHead>{team.name}</TableHead>
                                <TableHead>
                                    {permissions?.canShow && (
                                        <Button variant={'ghost'} size={'icon'} asChild>
                                            <Link href={route('team.show', team.id)}>
                                                <Folder />
                                            </Link>
                                        </Button>
                                    )}
                                    {permissions?.canUpdate && (
                                        <>
                                            <TeamFormSheet team={team} purpose="edit">
                                                <Button variant={'ghost'} size={'icon'}>
                                                    <Edit />
                                                </Button>
                                            </TeamFormSheet>
                                        </>
                                    )}
                                    {permissions?.canDelete && (
                                        <>
                                            <TeamDeleteDialog team={team}>
                                                <Button variant={'ghost'} size={'icon'}>
                                                    <Trash2 />
                                                </Button>
                                            </TeamDeleteDialog>
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

export default ListTeam;
