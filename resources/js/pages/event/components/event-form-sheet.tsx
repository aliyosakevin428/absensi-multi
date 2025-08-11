import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Event, EventType  } from '@/types';
import { useForm } from '@inertiajs/react';
import { ChevronDownIcon } from 'lucide-react';
import React, { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
    event?: Event;
    event_types: EventType[];
    purpose: 'create' | 'edit';
};

const EventFormDialog: FC<Props> = ({ children, event, event_types, purpose }) => {
    const [open, setOpen] = React.useState(false);
    const { data, setData, post, put } = useForm({
        name: event?.name ?? '',
        tanggal_kegiatan: event?.tanggal_kegiatan ?? '',
        waktu_kegiatan: event?.waktu_kegiatan ?? '',
        lokasi_kegiatan: event?.lokasi_kegiatan ?? '',
        event_types_id: event?.event_types.id ?? '',
    });

    const handleSubmit = () => {
        if (purpose === 'create') {
            post(route('event.store'));
        } else {
            put(route('event.update', event?.id));
        }
    };

    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="capitalize">{purpose} data Acara</DialogTitle>
                    <DialogDescription>Dialog ini digunakan untuk {purpose} data Acara atau event yang akan diadakan.</DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label>Nama Acara</Label>
                        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama Acara" />
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        <Label>Tanggal Masuk</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                                    {date ? date.toLocaleDateString() : 'Select date'}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        setDate(date);
                                        setOpen(false);
                                        if (date) {
                                            const formatted = date.toISOString().split('T')[0];
                                            setData('tgl_masuk', formatted);
                                        }
                                    }}
                                />
                            </PopoverContent>
                        </Popover>

                        <div className="flex flex-row items-center gap-2">
                            <Label>Divisi</Label>
                            <Select value={data.divisi_id.toString()} onValueChange={(value) => setData('divisi_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Divisi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {divisis.map((divisi) => (
                                        <SelectItem key={divisi.id} value={divisi.id.toString()}>
                                            {divisi.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Label>Jabatan</Label>
                            <Select value={data.jabatan_id.toString()} onValueChange={(value) => setData('jabatan_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jabatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {jabatans.map((jabatan) => (
                                        <SelectItem key={jabatan.id} value={jabatan.id.toString()}>
                                            {jabatan.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Alamat</Label>
                            <Input value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} placeholder="Alamat" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Nomor Telepon</Label>
                            <Input
                                value={data.nomor_telepon}
                                onChange={(e) => setData('nomor_telepon', e.target.value)}
                                placeholder="Nomor Telepon"
                            />
                        </div>

                        <Label>Status</Label>
                        <Select value={data.status.toString()} onValueChange={(value) => setData('status', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Aktif">Aktif</SelectItem>
                                <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        onClick={() => {
                            console.log('berhasil submit');
                            handleSubmit();
                            setOpen(false);
                        }}
                    >
                        Simpan
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EventFormDialog;
