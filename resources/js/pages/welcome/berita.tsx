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
            <SectionContainer
                title="Artikel Kegiatan Gereja"
                description="Informasi dan dokumentasi terbaru kegiatan Gereja Toraja Jemaat Lahai Roi Balikpapan"
            >
                {/* WRAPPER RELATIVE */}
                <div className="relative">
                    {/* BACKGROUND ILLUSTRATION */}
                    <img
                        src="/images/undraw/undraw_book-reading_i0eb.svg"
                        alt=""
                        aria-hidden
                        className="pointer-events-none absolute top-10 right-0 -z-10 w-80 opacity-[0.06]"
                    />

                    {/* CONTENT */}
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {news.map((berita) => (
                            <NewsItemCard key={berita.id} news={berita} />
                        ))}
                    </div>
                </div>
            </SectionContainer>
        </WelcomeLayout>
    );
};

export default Berita;
