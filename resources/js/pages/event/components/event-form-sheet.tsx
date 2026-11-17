import LocationPicker from '@/components/location-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Event, EventType } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { ChevronDownIcon, X } from 'lucide-react';
import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
    event?: Event;
    purpose: 'create' | 'edit';
};

const EventFormSheet: FC<Props> = ({ children, purpose, event }) => {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [date, setDate] = useState<Date>(event?.waktu_kegiatan ? new Date(event.waktu_kegiatan) : new Date());
    const [time, setTime] = useState<string>(event?.waktu_kegiatan ? dayjs(event.waktu_kegiatan).format('HH:mm') : '09:00');

    const { event_types } = usePage<{ event_types: EventType[] }>().props;

    const { data, setData, post, put, processing, errors } = useForm({
        name: event?.name ?? '',
        waktu_kegiatan: event?.waktu_kegiatan ?? '',
        lokasi_kegiatan: event?.lokasi_kegiatan ?? '',
        event_types_id: event?.event_types?.id?.toString() ?? event_types[0]?.id?.toString() ?? '',
        latitude: (event?.latitude ?? null) as number | null,
        longitude: (event?.longitude ?? null) as number | null,
        radius_m: event?.radius_m ?? 100,
        require_gps: event?.require_gps ?? true,
    });

    const resetForm = () => {
        if (purpose === 'create') {
            setData({
                name: '',
                waktu_kegiatan: '',
                lokasi_kegiatan: '',
                event_types_id: event_types[0]?.id?.toString() ?? '',
                latitude: null,
                longitude: null,
                radius_m: 100,
                require_gps: true,
            });
            setDate(new Date());
            setTime('09:00');
        } else if (event) {
            setData({
                name: event.name,
                waktu_kegiatan: event.waktu_kegiatan,
                lokasi_kegiatan: event.lokasi_kegiatan,
                event_types_id: event.event_types?.id?.toString() ?? '',
                latitude: event.latitude ?? null,
                longitude: event.longitude ?? null,
                radius_m: event.radius_m ?? 100,
                require_gps: event.require_gps ?? true,
            });
            setDate(new Date(event.waktu_kegiatan));
            setTime(dayjs(event.waktu_kegiatan).format('HH:mm'));
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.name || !data.waktu_kegiatan || !data.lokasi_kegiatan || !data.event_types_id) {
            toast.error('Semua field wajib diisi!');
            return;
        }

        if (data.require_gps && (data.latitude === null || data.longitude === null)) {
            toast.error('Pilih titik lokasi di peta dulu (GPS wajib aktif).');
            return;
        }

        const options = {
            onSuccess: () => {
                toast.success(purpose === 'create' ? 'Acara Berhasil Ditambahkan' : 'Acara Berhasil Diubah');
                setSheetOpen(false);
            },
        };

        if (purpose === 'create') {
            post(route('event.store'), options);
        } else {
            put(route('event.update', event?.id), options);
        }
    };

    return (
        <Dialog
            open={sheetOpen}
            onOpenChange={(open) => {
                setSheetOpen(open);
                if (open) resetForm();
            }}
        >
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-xl">
                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                    <DialogHeader className="border-b px-6 py-4">
                        <DialogTitle className="capitalize">{purpose} Your Event</DialogTitle>
                        <DialogDescription>Isi detail kegiatan di bawah ini.</DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
                        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama Acara" />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="date-picker" className="px-1">
                                    Tanggal Kegiatan
                                </Label>
                                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                    <PopoverTrigger asChild>
                                        <Button type="button" variant="outline" id="date-picker" className="w-full justify-between font-normal">
                                            {date ? date.toLocaleDateString() : 'Select date'}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
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

                        <div className="space-y-3 rounded-md border p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="require-gps">Wajib GPS saat absen</Label>
                                    <p className="text-xs opacity-70">Anggota harus berada di dalam radius lokasi.</p>
                                </div>
                                <Switch id="require-gps" checked={data.require_gps} onCheckedChange={(v) => setData('require_gps', v)} />
                            </div>

                            <LocationPicker
                                latitude={data.latitude}
                                longitude={data.longitude}
                                radius={Number(data.radius_m) || 100}
                                onChange={(lat, lng, address) =>
                                    setData((prev) => ({
                                        ...prev,
                                        latitude: lat,
                                        longitude: lng,
                                        lokasi_kegiatan: prev.lokasi_kegiatan || address || '',
                                    }))
                                }
                            />

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="radius">Radius absensi (meter)</Label>
                                <Input
                                    id="radius"
                                    type="number"
                                    min={10}
                                    max={1000}
                                    value={data.radius_m}
                                    onChange={(e) => setData('radius_m', Number(e.target.value))}
                                />
                                {errors.radius_m && <p className="text-sm text-red-500">{errors.radius_m}</p>}
                            </div>

                            {errors.latitude && <p className="text-sm text-red-500">{errors.latitude}</p>}
                        </div>
                    </div>

                    <DialogFooter className="border-t px-6 py-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                <X />
                                Close
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EventFormSheet;
