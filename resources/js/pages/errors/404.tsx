import Illustration from '@/components/illustration';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function NotFound() {
    return (
        <div className="flex min-h-dvh items-center justify-center bg-background px-6">
            <div className="grid max-w-5xl items-center gap-16 md:grid-cols-2">
                {/* ILLUSTRATION */}
                <div className="flex justify-center md:justify-end">
                    <div className="w-full max-w-xs md:max-w-sm lg:max-w-md">
                        <Illustration src="/images/undraw/undraw_page-not-found_6wni.svg" variant="primary" className="opacity-100" />
                    </div>
                </div>
                {/* TEXT */}
                <div className="space-y-6 text-center md:text-left">
                    <p className="text-sm font-medium tracking-wide text-muted-foreground">Error 404</p>

                    <h1 className="text-4xl leading-tight font-bold md:text-5xl">Halaman tidak ditemukan</h1>

                    <p className="text-lg leading-relaxed text-muted-foreground">
                        Maaf, halaman yang kamu cari tidak tersedia atau sudah dipindahkan. Silakan kembali ke halaman utama atau jelajahi menu
                        lainnya.
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button asChild size="lg">
                            <Link href={route('home')}>Kembali ke Beranda</Link>
                        </Button>

                        <Button asChild variant="outline" size="lg">
                            <Link href={route('berita')}>Lihat Artikel</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
