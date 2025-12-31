import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dateDFY, strLimit } from '@/lib/utils';
import { SharedData, User } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { CheckCircle, Edit, FileText, PlusCircle, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import WartaFormSheet from './components/warta-form-sheet';
import WartaDeleteDialog from './components/warta-delete-dialog';

type Warta = {
    id: number;
    title: string;
    file_url?: string;
    is_active: boolean;
    creator: User | null;
    created_at: string;
};

type Props = {
    wartas: Warta[];
};

const WartaIndex: FC<Props> = ({ wartas }) => {
    const [ids, setIds] = useState<number[]>([]);
    const [cari, setCari] = useState('');

    const { permissions } = usePage<SharedData>().props;

    const activateWarta = (id: number) => {
        router.post(route('warta-jemaat.activated', id));
    };

    return (
        <AppLayout
            title="Warta Jemaat"
            description="Manajemen dokumen warta jemaat gereja"
            actions={
                <WartaFormSheet purpose="create">
                    <Button>
                        <PlusCircle className="mr-1" />
                        Upload Warta Jemaat
                    </Button>
                </WartaFormSheet>
            }
        >
            <div className="mb-4 flex gap-2">
                <Input placeholder="Cari judul warta..." value={cari} onChange={(e) => setCari(e.target.value)} />

                {ids.length > 0 && (
                    <Button variant="ghost" disabled>
                        {ids.length} item selected
                    </Button>
                )}
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Button variant="ghost" size="icon" asChild>
                                <Label>
                                    <Checkbox
                                        checked={ids.length === wartas.length}
                                        onCheckedChange={(checked) => (checked ? setIds(wartas.map((w) => w.id)) : setIds([]))}
                                    />
                                </Label>
                            </Button>
                        </TableHead>
                        <TableHead>Judul Warta</TableHead>
                        <TableHead>File</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {wartas
                        .filter((w) => w.title.toLowerCase().includes(cari.toLowerCase()))
                        .map((warta) => (
                            <TableRow key={warta.id}>
                                <TableCell>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Label>
                                            <Checkbox
                                                checked={ids.includes(warta.id)}
                                                onCheckedChange={(checked) =>
                                                    checked ? setIds([...ids, warta.id]) : setIds(ids.filter((id) => id !== warta.id))
                                                }
                                            />
                                        </Label>
                                    </Button>
                                </TableCell>

                                <TableCell>{strLimit(warta.title)}</TableCell>

                                <TableCell>
                                    {warta.file_url ? (
                                        <a href={warta.file_url} target="_blank" className="text-blue-600 underline hover:text-blue-800">
                                            Lihat File
                                        </a>
                                    ) : (
                                        '-'
                                    )}
                                </TableCell>

                                <TableCell>
                                    {warta.is_active ? (
                                        <Badge>
                                            <CheckCircle className="mr-1 h-3 w-3" />
                                            Aktif
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary">Tidak Aktif</Badge>
                                    )}
                                </TableCell>

                                <TableCell>{warta.creator?.name ?? '-'}</TableCell>

                                <TableCell>{dateDFY(warta.created_at)}</TableCell>

                                <TableCell className="flex gap-1">
                                    {/* Activate */}
                                    <Button variant="ghost" size="icon" onClick={() => activateWarta(warta.id)}>
                                        <CheckCircle />
                                    </Button>

                                    {/* Edit */}
                                    <WartaFormSheet purpose="edit" warta={warta}>
                                        <Button variant="ghost" size="icon">
                                            <Edit />
                                        </Button>
                                    </WartaFormSheet>

                                    {/* Show */}
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={route('warta-jemaat.show', warta.id)}>
                                            <FileText />
                                        </Link>
                                    </Button>

                                    {/* Delete */}
                                    <WartaDeleteDialog warta={warta}>
                                        <Button variant="ghost" size="icon">
                                            <Trash2 />
                                        </Button>
                                    </WartaDeleteDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </AppLayout>
    );
};

export default WartaIndex;
