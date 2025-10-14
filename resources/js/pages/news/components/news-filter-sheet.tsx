import FormControl from '@/components/form-control';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { User } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
    query: { [key: string]: string };
};

const NewsFilterSheet: FC<Props> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const { users = [] } = usePage<{ users: User[] }>().props;

    const { data, setData, get } = useForm({
        user_id: '',
    });

    const applyFilter = () => {
        get(route('news.index'), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onSuccess: () => {
                toast.success('Filter applied successfully');
                setOpen(false);
            },
        });
    };

    const resetFilter = () => {
        setData('user_id', '');
        router.get(
            route('news.index'),
            {
                user_id: '',
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Filter news</SheetTitle>
                    <SheetDescription>Filter data news</SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-1 overflow-y-auto">
                    <form
                        method="get"
                        className="space-y-6 px-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            applyFilter();
                        }}
                    >
                        <FormControl label="Nama Creator">
                            <Select value={data.user_id} onValueChange={(v) => setData('user_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem value={user.id.toString()}>{user.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                    </form>
                </ScrollArea>
                <SheetFooter>
                    <Button type="submit" onClick={applyFilter}>
                        <Check /> Apply filter
                    </Button>
                    <Button variant={'outline'} onClick={resetFilter}>
                        <X /> Reset filter
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default NewsFilterSheet;
