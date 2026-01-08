import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="grid min-h-dvh lg:grid-cols-[3fr_2fr]">
            <div className="relative hidden flex-col border-r bg-muted px-12 py-10 lg:flex">
                <Link href={route('home')} className="mt-12 mb-10 flex items-center gap-3 text-lg font-semibold tracking-tight text-foreground">
                    <AppLogoIcon className="size-9 fill-current text-primary" />
                    <span>Multimedia Official</span>
                </Link>

                <div className="flex flex-1 items-center justify-center">
                    <div className="flex w-full max-w-md flex-col items-center gap-6">
                        <img src="/images/undraw/undraw_unlock_m0yr.svg" alt="" aria-hidden loading="lazy" className="w-full opacity-90" />

                        <p className="max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
                            Akses aman dan terkelola untuk mendukung setiap pelayanan dan kegiatan Multimedia Gereja Toraja Jemaat Lahai Roi
                            Balikpapan.
                        </p>
                    </div>
                </div>
            </div>

            <Button asChild variant="ghost" size="sm" className="absolute top-6 left-10 gap-2 text-muted-foreground hover:text-foreground">
                <Link href={route('home')}>
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                </Link>
            </Button>

            <div className="flex items-center justify-center bg-background px-6 py-12">
                <div className="w-full max-w-sm space-y-6">
                    <Link href={route('home')} className="flex justify-center lg:hidden">
                        <AppLogoIcon className="h-10 fill-current text-primary" />
                    </Link>

                    <div className="space-y-1 text-center">
                        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
                        {description && <p className="text-sm text-muted-foreground">{description}</p>}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
