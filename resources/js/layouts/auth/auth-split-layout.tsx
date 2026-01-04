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
        <div className="grid min-h-dvh lg:grid-cols-2">
            {/* LEFT — BRAND + ILLUSTRATION */}
            <div className="relative hidden flex-col border-r bg-muted p-10 lg:flex">
                {/* Back Button */}
                <Button asChild variant="ghost" size="sm" className="absolute top-6 left-6 gap-2">
                    <Link href={route('home')}>
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                </Button>

                {/* Brand */}
                <Link href={route('home')} className="mt-10 flex items-center gap-2 text-lg font-semibold text-foreground">
                    <AppLogoIcon className="size-8 fill-current text-primary" />
                    Multimedia Official
                </Link>

                {/* Illustration */}
                <div className="flex flex-1 items-center justify-center">
                    <img src="/images/undraw/undraw_unlock_m0yr.svg" alt="" aria-hidden loading="lazy" className="w-full max-w-sm opacity-90" />
                </div>

                <div className="mt-auto text-sm text-muted-foreground">
                    <p className="leading-relaxed">
                        Melayani dengan teknologi dan kreativitas untuk mendukung setiap ibadah dan kegiatan Gereja Toraja Jemaat Lahai Roi
                        Balikpapan.
                    </p>
                </div>
            </div>

            {/* RIGHT — LOGIN FORM */}
            <div className="flex items-center justify-center bg-background px-6 py-12">
                <div className="w-full max-w-sm space-y-6">
                    {/* Mobile Logo */}
                    <Link href={route('home')} className="flex justify-center lg:hidden">
                        <AppLogoIcon className="h-10 fill-current text-primary" />
                    </Link>

                    {/* Title */}
                    <div className="space-y-1 text-center">
                        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
                        {description && <p className="text-sm text-muted-foreground">{description}</p>}
                    </div>

                    {/* Form */}
                    {children}
                </div>
            </div>
        </div>
    );
}
