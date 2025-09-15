import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { AbsentReason } from '@/types';
import { FC } from 'react';

type Props = {
    absentreason: AbsentReason;
};

const showAbsentReason: FC<Props> = ({ absentreason }) => {
    return (
        <AppLayout title="Detail absent" description="Detail absent">
            <Card>
                <CardHeader>
                    <CardTitle>{absentreason.name}</CardTitle>
                    <CardDescription>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, quo impedit cupiditate voluptas culpa magnam itaque distinctio
                        at ullam, beatae perferendis doloremque facilis mollitia, quod corporis. Autem voluptatum ipsum placeat.
                    </CardDescription>
                </CardHeader>
            </Card>
        </AppLayout>
    );
};

export default showAbsentReason;
