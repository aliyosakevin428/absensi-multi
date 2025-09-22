import BackButton from '@/components/back-button';
import MarkdownReader from '@/components/markdown-reader';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import AppLayout from '@/layouts/app-layout';
import { News } from '@/types';
import { Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { FC } from 'react';

type Props = {
    news: News;
};

const ShowNews: FC<Props> = ({ news }) => {
    return (
        <AppLayout
            title="Detail News"
            description="Detail news"
            actions={
                <>
                    <BackButton />
                    <Button asChild>
                        <Link href={route('news.edit', news.id)}>
                            <Edit />
                            Edit Content
                        </Link>
                    </Button>
                </>
            }
        >
            <div className="mx-auto max-w-3xl space-y-10">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-3xl font-bold">{news.title}</h1>
                    <p className="text-muted-foreground">{news.description}</p>
                </div>
                {(news.media ?? []).length > 0 && (
                    <Carousel>
                        <CarouselContent>
                            {news.media.map((m) => (
                                <CarouselItem key={m.id}>
                                    <img src={m.original_url} className="rounded-lg" />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                )}
                <MarkdownReader content={news.content} />
            </div>
        </AppLayout>
    );
};

export default ShowNews;
