import { News } from '@/types';
import { FC } from 'react';
import NewsItemCard from '../news/components/news-item-card';
import SectionContainer from './layouts/section-container';
import WelcomeLayout from './layouts/welcome-layout';

type Props = {
    news: News[];
};

const Berita: FC<Props> = ({ news }) => {
    return (
        <WelcomeLayout>
            <SectionContainer title="Artikel Kegiatan Yang Berlangsung di Gereja" description="Artikel kegiatan Gereja terbaru">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {news.map((berita) => (
                        <NewsItemCard news={berita} key={berita.id} />
                    ))}
                </div>
            </SectionContainer>
        </WelcomeLayout>
    );
};

export default Berita;
