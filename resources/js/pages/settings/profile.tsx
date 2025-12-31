import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
    kontak: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
        kontak: auth.user.kontak,
    });

    const photoForm = useForm<{ photo: File | null }>({
        photo: null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Profile Settings" description="Update your account's profile information and email address">
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div>
                            <Label htmlFor="kontak">Kontak / Nomor Telepon</Label>

                            <Input
                                id="kontak"
                                type="tel"
                                className="mt-1 block w-full"
                                value={data.kontak}
                                maxLength={20}
                                inputMode="numeric"
                                onChange={(e) => setData('kontak', e.target.value)}
                                placeholder="Kontak"
                            />

                            <InputError className="mt-2" message={errors.kontak} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <HeadingSmall title="Profile photo" description="Upload or change your profile photo" />

                    <div className="flex items-center gap-6">
                        <img src={preview ?? auth.user.avatar} alt="Profile photo" className="h-24 w-24 rounded-full border object-cover" />

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                photoForm.post(route('profile.photo.update'), {
                                    forceFormData: true,
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        setPreview(null);
                                        photoForm.reset();
                                        toast.success('Foto profil berhasil diperbarui');
                                    },
                                });
                            }}
                            className="space-y-3"
                        >
                            <Input
                                type="file"
                                accept="image/jpeg,image/png"
                                disabled={photoForm.processing}
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    photoForm.setData('photo', file);

                                    if (file) {
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />

                            <InputError message={photoForm.errors.photo} />

                            <div className="flex gap-3">
                                <Button disabled={photoForm.processing}>{photoForm.processing ? 'Uploading...' : 'Upload / Change'}</Button>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    disabled={photoForm.processing}
                                    onClick={() => {
                                        if (confirm('Hapus foto profil?')) {
                                            photoForm.delete(route('profile.photo.delete'), {
                                                preserveScroll: true,
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

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
