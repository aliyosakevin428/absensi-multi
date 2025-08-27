import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Event, EventType } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { ChevronDownIcon } from 'lucide-react';
import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
    event?: Event;
    purpose: 'create' | 'edit';
};

const EventFormSheet: FC<Props> = ({ children, purpose, event }) => {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(event?.waktu_kegiatan ? new Date(event.waktu_kegiatan) : new Date());
    const [time, setTime] = useState<string>(
        event?.waktu_kegiatan ? new Date(event.waktu_kegiatan).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '09:00',
    );

    const { event_types } = usePage<{ event_types: EventType[] }>().props;

    const { data, setData, post, put, processing } = useForm({
        name: event?.name ?? '',
        waktu_kegiatan: event?.waktu_kegiatan ?? '',
        lokasi_kegiatan: event?.lokasi_kegiatan ?? '',
        event_types_id: event?.event_types.id?.toString() ?? (event_types.length > 0 ? event_types[0].id.toString() : ''),
    });

    const resetForm = () => {
        if (purpose === 'create') {
            setData({
                name: '',
                waktu_kegiatan: '',
                lokasi_kegiatan: '',
                event_types_id: '',
            });
        } else if (event) {
            setData({
                name: event.name,
                waktu_kegiatan: event.waktu_kegiatan,
                lokasi_kegiatan: event.lokasi_kegiatan,
                event_types_id: event.event_types.id?.toString() ?? '',
            });
        }
    };

    // Sync date & time ke data.waktu_kegiatan
    useEffect(() => {
        if (date && time) {
            const [hours, minutes] = time.split(':').map(Number);
            const combinedDate = new Date(date);
            combinedDate.setHours(hours, minutes, 0);
            setData('waktu_kegiatan', dayjs(combinedDate).format('YYYY-MM-DD HH:mm:ss'));
        }
    }, [date, time, setData]);
    console.log(data);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.name || !data.waktu_kegiatan || !data.lokasi_kegiatan || !data.event_types_id) {
            alert('Semua field wajib diisi!');
            return;
        }

        if (purpose === 'create') {
            post(route('event.store'), {
                onSuccess: () => toast.success('Acara Berhasil Ditambahkan'),
                onFinish: () => setSheetOpen(false),
            });
        } else {
            put(route('event.update', event?.id), {
                onSuccess: () => toast.success('Acara Berhasil Diubah'),
                onFinish: () => setSheetOpen(false),
            });
        }
    };

    return (
        <Sheet
            open={sheetOpen}
            onOpenChange={(open) => {
                setSheetOpen(open);
                if (open) resetForm();
            }}
        >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent>
                <form onSubmit={handleSubmit}>
                    <SheetHeader>
                        <SheetTitle className="capitalize">{purpose} Your Event</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-4 px-4 py-6">
                        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama Acara" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="date-picker" className="px-1">
                                    Tanggal Kegiatan
                                </Label>
                                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" id="date-picker" className="w-full justify-between font-normal">
                                            {date ? date.toLocaleDateString() : 'Select date'}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            captionLayout="dropdown"
                                            onSelect={(d) => {
                                                if (d) setDate(d);
                                                setCalendarOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="time-picker" className="px-1">
                                    Waktu Kegiatan
                                </Label>
                                <Input type="time" id="time-picker" value={time} onChange={(e) => setTime(e.target.value)} />
                            </div>
                        </div>
                        <Input
                            value={data.lokasi_kegiatan}
                            onChange={(e) => setData('lokasi_kegiatan', e.target.value)}
                            placeholder="Lokasi Kegiatan"
                            required
                        />
                        <Select value={data.event_types_id} onValueChange={(value) => setData('event_types_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jenis Acara" />
                            </SelectTrigger>
                            <SelectContent>
                                {event_types?.map((type) => (
                                    <SelectItem key={type.id} value={type.id.toString()}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <SheetFooter>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        <SheetClose asChild>
                            <Button variant="outline">Tutup</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export default EventFormSheet;
