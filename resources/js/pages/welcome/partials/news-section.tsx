import { Button } from '@/components/ui/button';
import NewsItemCard from '@/pages/news/components/news-item-card';
import { News } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import SectionContainer from '../layouts/section-container';

const NewsSection = () => {
    const { news } = usePage<{ news: News[] }>().props;

    return (
        <SectionContainer title="Kegiatan terbaru" description="Berita kegiatan sekolah terbaru">
            <div className="grid gap-6 md:grid-cols-3">
                {news.map((berita) => (
                    <NewsItemCard news={berita} key={berita.id} />
                ))}
            </div>

            <div className="flex items-center justify-center">
                <Button asChild>
                    <Link href={route('berita')}>
                        <BookOpen />
                        Baca berita lainnya
                    </Link>
                </Button>
            </div>
        </SectionContainer>
    );
};

export default NewsSection;
