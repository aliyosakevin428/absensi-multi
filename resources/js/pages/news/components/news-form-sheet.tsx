import FormControl from '@/components/form-control';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { capitalizeWords, em } from '@/lib/utils';
import { FormPurpose, News, User } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
    news?: News;
    purpose: FormPurpose;
};

const NewsFormSheet: FC<Props> = ({ children, news, purpose }) => {
    const [open, setOpen] = useState(false);

    const { users = [] } = usePage<{ users: User[] }>().props;

    const { data, setData, put, post, reset, processing } = useForm({
        title: news?.title ?? '',
        user_id: news?.user_id ?? '',
    });

    const handleSubmit = () => {
        if (purpose === 'create' || purpose === 'duplicate') {
            post(route('news.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('News created successfully');
                    reset();
                    setOpen(false);
                },
                onError: (e) => toast.error(em(e)),
            });
        } else {
            put(route('news.update', news?.id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('News updated successfully');
                    setOpen(false);
                },
                onError: (e) => toast.error(em(e)),
            });
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{capitalizeWords(purpose)} data news</SheetTitle>
                    <SheetDescription>Form untuk {purpose} data news</SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-1 overflow-y-auto">
                    <form
                        className="space-y-6 px-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <FormControl label="Judul news">
                            <Input type="text" placeholder="Judul" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                        </FormControl>
                        <Select value={data.user_id.toString()} onValueChange={(value) => setData('user_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Dibuat oleh" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </form>
                </ScrollArea>
                <SheetFooter>
                    <SubmitButton onClick={handleSubmit} label={`${capitalizeWords(purpose)} news`} loading={processing} disabled={processing} />
                    <SheetClose asChild>
                        <Button variant={'outline'}>
                            <X /> Close
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default NewsFormSheet;
