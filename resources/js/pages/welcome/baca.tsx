import MarkdownReader from '@/components/markdown-reader';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { News } from '@/types';
import { FC } from 'react';
import SectionContainer from './layouts/section-container';
import WelcomeLayout from './layouts/welcome-layout';

type Props = {
    news: News;
};

const Baca: FC<Props> = ({ news }) => {
    return (
        <WelcomeLayout>
            <SectionContainer title={news.title} description={news.description} className="mx-auto max-w-3xl space-y-10">
                {(news.media ?? []).length > 0 && (
                    <Carousel>
                        <CarouselContent>
                            {news.media.map((m) => (
                                <CarouselItem key={m.id}>
                                    <img src={m.original_url} className="h-full w-full rounded-lg object-cover" />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                )}
                <MarkdownReader content={news.content} className="mx-auto max-w-6xl space-y-4 text-base leading-relaxed text-foreground" />
            </SectionContainer>
        </WelcomeLayout>
    );
};

export default Baca;
