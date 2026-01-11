import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import getCroppedImage from '@/lib/utils';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Profile settings', href: '/settings/profile' }];

type ProfileForm = {
    name: string;
    email: string;
    kontak: string;
};

export default function Profile({ mustVerifyEmail }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
        kontak: auth.user.kontak,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'), { preserveScroll: true });
    };

    const photoForm = useForm<{ photo: File | null }>({
        photo: null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const [image, setImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [openCropper, setOpenCropper] = useState(false);

    const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Profile Settings" description="Update your account's profile information and email address">
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Kontak</Label>
                            <Input value={data.kontak} onChange={(e) => setData('kontak', e.target.value)} />
                            <InputError message={errors.kontak} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <p className="text-sm text-muted-foreground">
                                Email belum diverifikasi.{' '}
                                <Link href={route('verification.send')} method="post" as="button" className="underline">
                                    Kirim ulang email verifikasi
                                </Link>
                            </p>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition show={recentlySuccessful}>
                                <p className="text-sm text-muted-foreground">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <HeadingSmall title="Profile photo" description="Upload or change your profile photo" />

                    <div className="flex items-center gap-6">
                        <img src={preview ?? auth.user.avatar} className="h-24 w-24 rounded-full border object-cover" />

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                photoForm.post(route('profile.photo.update'), {
                                    forceFormData: true,
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        toast.success('Foto profil berhasil diperbarui');
                                        setPreview(null);
                                        photoForm.reset();
                                    },
                                });
                            }}
                            className="space-y-3"
                        >
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        setImage(reader.result as string);
                                        setOpenCropper(true);
                                    };
                                    reader.readAsDataURL(file);
                                }}
                            />

                            <InputError message={photoForm.errors.photo} />

                            <div className="flex gap-3">
                                <Button>Upload</Button>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => {
                                        if (confirm('Hapus foto profil?')) {
                                            photoForm.delete(route('profile.photo.delete'), {
                                                onSuccess: () => setPreview(null),
                                            });
                                        }
                                    }}
                                >
                                    Remove
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                <Dialog open={openCropper} onOpenChange={setOpenCropper}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Sesuaikan Foto Profil</DialogTitle>
                        </DialogHeader>

                        {image && (
                            <div className="relative h-72 w-full bg-black">
                                <Cropper
                                    image={image}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    cropShape="round"
                                    showGrid={false}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setOpenCropper(false);
                                    setImage(null);
                                }}
                            >
                                Batal
                            </Button>

                            <Button
                                onClick={async () => {
                                    if (!image || !croppedAreaPixels) return;

                                    const blob = await getCroppedImage(image, croppedAreaPixels);

                                    const file = new File([blob], 'avatar.jpg', {
                                        type: 'image/jpeg',
                                    });

                                    photoForm.setData('photo', file);
                                    setPreview(URL.createObjectURL(blob));
                                    setOpenCropper(false);
                                    setImage(null);
                                }}
                            >
                                Gunakan Foto
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
