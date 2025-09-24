import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Facebook, Home, Info, Instagram, Newspaper, Youtube } from 'lucide-react';

const WelcomeFooter = () => {
    const { quote } = usePage<SharedData>().props;

    return (
        <footer className="border-t bg-background">
            <div className="mx-auto max-w-6xl space-y-8 px-6 py-12">
                {/* Bagian atas: Quote + Sosmed */}
                <div className="grid gap-8 md:grid-cols-2 md:items-center">
                    {/* Quote */}
                    <div>
                        <p className="text-lg leading-relaxed text-muted-foreground italic">"{quote.message}"</p>
                        <p className="mt-3 font-semibold text-foreground">" {quote.author} "</p>
                    </div>

                    {/* Sosmed */}
                    <div className="flex justify-start gap-6 md:justify-end">
                        <a
                            href="https://web.facebook.com/gerejatoraja.lahairoibpn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                        >
                            <Facebook className="h-8 w-8" />
                        </a>
                        <Link href="https://instagram.com" target="_blank" className="text-muted-foreground hover:text-primary">
                            <Instagram className="h-8 w-8" />
                        </Link>
                        <a
                            href="https://www.youtube.com/@lahairoichannel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                        >
                            <Youtube className="h-8 w-8" />
                        </a>
                    </div>
                </div>

                {/* Bagian bawah: Copyright + Link */}
                <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
                    <p>
                        © {new Date().getFullYear()} <span className="font-semibold">Multimedia Lahai Roi Balikpapan</span> | All rights reserved
                    </p>
                    <div className="flex gap-6">
                        <Link href="/" className="flex items-center gap-1 transition hover:scale-105 hover:text-primary">
                            <Home className="h-4 w-4" /> Beranda
                        </Link>
                        <Link href="/about" className="flex items-center gap-1 transition hover:scale-105 hover:text-primary">
                            <Info className="h-4 w-4" /> Tentang
                        </Link>
                        <Link href="/berita" className="flex items-center gap-1 transition hover:scale-105 hover:text-primary">
                            <Newspaper className="h-4 w-4" /> Berita
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default WelcomeFooter;
