import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { em } from '@/lib/utils';
import { News } from '@/types';
import { useForm } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { FC, PropsWithChildren } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
    newsIds: News['id'][];
};

const NewsBulkEditSheet: FC<Props> = ({ children, newsIds }) => {
    const { data, put } = useForm({
        news_ids: newsIds,
    });

    const handleSubmit = () => {
        put(route('news.bulk.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('News updated successfully');
            },
            onError: (e) => toast.error(em(e)),
        });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Ubah news</SheetTitle>
                    <SheetDescription>Ubah data {data.news_ids.length} news</SheetDescription>
                </SheetHeader>
                <SheetFooter>
                    <Button type="submit" onClick={handleSubmit}>
                        <Check /> Simpan news
                    </Button>
                    <SheetClose asChild>
                        <Button variant={'outline'}>
                            <X /> Batalin
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default NewsBulkEditSheet;
