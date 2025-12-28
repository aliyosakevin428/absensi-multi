import FormControl from '@/components/form-control';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { capitalizeWords, em } from '@/lib/utils';
import { FormPurpose } from '@/types';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Warta = {
    id: number;
    title: string;
    file_url?: string;
};

type Props = PropsWithChildren & {
    warta?: Warta;
    purpose: FormPurpose; // create | edit
};

const WartaFormSheet: FC<Props> = ({ children, warta, purpose }) => {
    const [open, setOpen] = useState(false);

    const { data, setData, post, put, reset, processing } = useForm<{
        title: string;
        file: File | null;
    }>({
        title: warta?.title ?? '',
        file: null,
    });

    const handleSubmit = () => {
        if (purpose === 'create') {
            post(route('warta-jemaat.store'), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Warta jemaat berhasil diunggah');
                    reset();
                    setOpen(false);
                },
                onError: (e) => toast.error(em(e)),
            });
        } else if (purpose === 'edit' && warta) {
            put(route('warta-jemaat.update', warta.id), {
                forceFormData: true, // penting untuk upload file
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Warta jemaat berhasil diperbarui');
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
                    <SheetTitle>{capitalizeWords(purpose)} Warta Jemaat</SheetTitle>
                    <SheetDescription>Form untuk {purpose} dokumen warta jemaat</SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 overflow-y-auto">
                    <form
                        className="space-y-6 px-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        {/* Judul */}
                        <FormControl label="Judul Warta">
                            <Input
                                type="text"
                                placeholder="Judul Warta Jemaat"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                            />
                        </FormControl>

                        {/* File PDF (create & edit) */}
                        <FormControl label={purpose === 'create' ? 'File Warta (PDF)' : 'Ganti File Warta (PDF)'}>
                            <Input type="file" accept="application/pdf" onChange={(e) => setData('file', e.target.files?.[0] ?? null)} />
                        </FormControl>

                        {/* Link file lama saat edit */}
                        {purpose === 'edit' && warta?.file_url && (
                            <div className="text-sm text-gray-600">
                                File saat ini:{' '}
                                <a href={warta.file_url} target="_blank" className="text-blue-600 underline">
                                    Lihat file
                                </a>
                            </div>
                        )}
                    </form>
                </ScrollArea>

                <SheetFooter className="flex gap-2">
                    <SubmitButton onClick={handleSubmit} label={`${capitalizeWords(purpose)} warta`} loading={processing} disabled={processing} />

                    <SheetClose asChild>
                        <Button variant="outline">
                            <X /> Close
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default WartaFormSheet;
