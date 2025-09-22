import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { News } from '@/types';
import { router } from '@inertiajs/react';
import { FC } from 'react';

type Props = {
    news: News;
    href?: string;
};

const NewsItemCard: FC<Props> = ({ news, href }) => {
    return (
        <Card className="flex flex-col justify-between" onClick={() => router.visit(href ?? route('baca', news.slug))}>
            <CardContent>
                <Avatar className="aspect-video size-full rounded-lg">
                    <AvatarImage src={news.thumbnail} className="object-cover" />
                </Avatar>
            </CardContent>
            <CardHeader>
                <CardTitle className="leading-6">{news.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{news.description}</CardDescription>
            </CardContent>
        </Card>
    );
};

export default NewsItemCard;
