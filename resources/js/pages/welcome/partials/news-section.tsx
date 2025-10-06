import { Button } from '@/components/ui/button';
import NewsItemCard from '@/pages/news/components/news-item-card';
import { News } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import SectionContainer from '../layouts/section-container';

const NewsSection = () => {
    const { news = [] } = usePage<{ news: News[] }>().props;

    return (
        <SectionContainer>
            <div className="mx-auto w-full space-y-1 py-4 text-center">
                <h3 className="px-4 text-3xl font-bold text-foreground">Kegiatan Gereja yang sedang berlangsung dan Warta Jemaat</h3>
                <p className="px-4 py-5 text-lg text-foreground">Artikel kegiatan Gereja terbaru</p>
                <div className="grid gap-6 md:grid-cols-3">
                    {news.map((berita) => (
                        <NewsItemCard news={berita} key={berita.id.toString()} />
                    ))}
                </div>
                <div className="flex items-center justify-center py-4">
                    <Button asChild>
                        <Link href={route('berita')}>
                            <BookOpen />
                            Baca berita lainnya
                        </Link>
                    </Button>
                </div>
            </div>
        </SectionContainer>
    );
};

export default NewsSection;
