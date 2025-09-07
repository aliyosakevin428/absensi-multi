import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { AbsentReason, Attendance, Event, User } from '@/types';
import { useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
    attendance?: Attendance;
    users?: User[];
    events?: Event[];
    absent?: AbsentReason[];
    purpose: 'create' | 'edit';
};

const AttendanceFormSheet: FC<Props> = ({ children, purpose, attendance, users = [], events, absent }) => {
    const [sheetOpen, setSheetOpen] = useState(false);

    const { data, setData, post, put, processing } = useForm({
        users_id: attendance?.users?.map((u) => u.id.toString()) ?? [], // selalu array string
        events_id: attendance?.event?.id?.toString() ?? '',
        status: attendance?.status ?? '',
        absent_reasons_id: attendance?.absent_reason?.id?.toString() ?? '',
    });

    const USER_OPTIONS: Option[] = users.map((user) => ({
        value: user.id.toString(),
        label: user.name,
    }));

    const statusOptions = [
        { value: 'Rencana', label: 'Rencana' },
        { value: 'Sedang Berlangsung', label: 'Sedang Berlangsung' },
        { value: 'Sudah Terlaksana', label: 'Sudah Terlaksana' },
        { value: 'Dibatalkan', label: 'Dibatalkan' },
    ];

    console.log(data);

    const handleSubmit = () => {
        if (purpose === 'create') {
            post(route('attendance.store'), {
                onSuccess: () => toast.success('Absensi Berhasil Ditambahkan'),
                onFinish: () => setSheetOpen(false),
            });
        } else {
            put(route('attendance.update', attendance?.id), {
                onSuccess: () => toast.success('Absensi Berhasil Diubah'),
                onFinish: () => setSheetOpen(false),
            });
        }
    };

    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="capitalize">{purpose} Attendance</SheetTitle>
                </SheetHeader>
                <MultipleSelector
                    value={USER_OPTIONS.filter((opt) => data.users_id.includes(opt.value))}
                    onChange={(values: Option[]) =>
                        setData(
                            'users_id',
                            values.map((v) => v.value),
                        )
                    }
                    options={USER_OPTIONS} // ini harus terisi
                    placeholder="Pilih Anggota..."
                />

                <Select value={data.events_id} onValueChange={(value) => setData('events_id', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Acara ..." />
                    </SelectTrigger>
                    <SelectContent>
                        {events?.map((event) => (
                            <SelectItem key={event.id} value={event.id.toString()}>
                                {event.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={data.absent_reasons_id} onValueChange={(value) => setData('absent_reasons_id', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Hadir / Tidak Hadir" />
                    </SelectTrigger>
                    <SelectContent>
                        {absent?.map((reason) => (
                            <SelectItem key={reason.id} value={reason.id.toString()}>
                                {reason.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between">
                            {data.status ? statusOptions.find((s) => s.value === data.status)?.label : 'Pilih Status Acara'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Cari status..." />
                            <CommandList>
                                <CommandEmpty>Status tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                    {statusOptions.map((status) => (
                                        <CommandItem key={status.value} value={status.value} onSelect={(value) => setData('status', value)}>
                                            <Check className={cn('mr-2 h-4 w-4', data.status === status.value ? 'opacity-100' : 'opacity-0')} />
                                            {status.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                <SheetFooter>
                    <Button onClick={handleSubmit} type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                    <SheetClose asChild>
                        <Button>Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default AttendanceFormSheet;
