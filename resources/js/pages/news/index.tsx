import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dateDFY, strLimit } from '@/lib/utils';
import { News, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Edit, Filter, Folder, PlusCircle, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import NewsBulkDeleteDialog from './components/news-bulk-delete-dialog';
import NewsBulkEditSheet from './components/news-bulk-edit-sheet';
import NewsDeleteDialog from './components/news-delete-dialog';
import NewsFilterSheet from './components/news-filter-sheet';
import NewsFormSheet from './components/news-form-sheet';

type Props = {
    news: News[];
    query: { [key: string]: string };
};

const NewsList: FC<Props> = ({ news, query }) => {
    const [ids, setIds] = useState<number[]>([]);
    const [cari, setCari] = useState('');

    const { permissions } = usePage<SharedData>().props;

    return (
        <AppLayout
            title="Artikel Settings"
            description="List artikel / warta jemaat gereja yang sedang berlangsung"
            actions={
                <>
                    {permissions?.canAdd && (
                        <NewsFormSheet purpose="create">
                            <Button>
                                <PlusCircle />
                                Buat Berita Baru
                            </Button>
                        </NewsFormSheet>
                    )}
                </>
            }
        >
            <div className="flex gap-2">
                <Input placeholder="Search news..." value={cari} onChange={(e) => setCari(e.target.value)} />
                <NewsFilterSheet query={query}>
                    <Button>
                        <Filter />
                        Filter data
                        {Object.values(query).filter((val) => val && val !== '').length > 0 && (
                            <Badge variant="secondary">{Object.values(query).filter((val) => val && val !== '').length}</Badge>
                        )}
                    </Button>
                </NewsFilterSheet>
                {ids.length > 0 && (
                    <>
                        <Button variant={'ghost'} disabled>
                            {ids.length} item selected
                        </Button>
                        <NewsBulkEditSheet newsIds={ids}>
                            <Button>
                                <Edit /> Edit selected
                            </Button>
                        </NewsBulkEditSheet>
                        <NewsBulkDeleteDialog newsIds={ids}>
                            <Button variant={'destructive'}>
                                <Trash2 /> Delete selected
                            </Button>
                        </NewsBulkDeleteDialog>
                    </>
                )}
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Button variant={'ghost'} size={'icon'} asChild>
                                <Label>
                                    <Checkbox
                                        checked={ids.length === news.length}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setIds(news.map((news) => news.id));
                                            } else {
                                                setIds([]);
                                            }
                                        }}
                                    />
                                </Label>
                            </Button>
                        </TableHead>
                        <TableHead>Judul berita</TableHead>
                        <TableHead>Isi berita</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Dibuat pada Tanggal</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {news
                        .filter((news) => JSON.stringify(news).toLowerCase().includes(cari.toLowerCase()))
                        .map((news) => (
                            <TableRow key={news.id}>
                                <TableCell>
                                    <Button variant={'ghost'} size={'icon'} asChild>
                                        <Label>
                                            <Checkbox
                                                checked={ids.includes(news.id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setIds([...ids, news.id]);
                                                    } else {
                                                        setIds(ids.filter((id) => id !== news.id));
                                                    }
                                                }}
                                            />
                                        </Label>
                                    </Button>
                                </TableCell>
                                <TableCell>{strLimit(news.title)}</TableCell>
                                <TableCell>{strLimit(news.content) || 'N/A'}</TableCell>
                                <TableCell>{news.user.name}</TableCell>
                                <TableCell>{dateDFY(news.created_at)}</TableCell>
                                <TableCell>
                                    {permissions?.canShow && (
                                        <Button variant={'ghost'} size={'icon'}>
                                            <Link href={route('news.edit', news.id)}>
                                                <Folder />
                                            </Link>
                                        </Button>
                                    )}
                                    {permissions?.canUpdate && (
                                        <NewsFormSheet purpose="edit" news={news}>
                                            <Button variant={'ghost'} size={'icon'}>
                                                <Edit />
                                            </Button>
                                        </NewsFormSheet>
                                    )}
                                    {permissions?.canDelete && (
                                        <NewsDeleteDialog news={news}>
                                            <Button variant={'ghost'} size={'icon'}>
                                                <Trash2 />
                                            </Button>
                                        </NewsDeleteDialog>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </AppLayout>
    );
};

export default NewsList;
