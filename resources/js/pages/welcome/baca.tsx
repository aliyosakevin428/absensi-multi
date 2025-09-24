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
                <MarkdownReader
                    content={news.content}
                    className="prose prose-lg prose-invert prose-headings:font-bold prose-headings:text-primary prose-p:my-4 prose-li:my-1 prose-li:marker:text-primary prose-strong:text-primary prose-a:text-blue-500 hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md mx-auto max-w-3xl text-justify leading-relaxed"
                />
            </SectionContainer>
        </WelcomeLayout>
    );
};

export default Baca;
