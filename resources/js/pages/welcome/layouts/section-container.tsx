import { cn } from '@/lib/utils';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
    title?: string;
    description?: string;
    className?: string;
};

const SectionContainer: FC<Props> = ({ children, title, description, className }) => {
    return (
        <div className={cn('mx-auto w-full max-w-6xl space-y-10 px-6 py-5 text-lg', className)}>
            {title && description && (
                <div className="flex flex-col items-center space-y-1.5 text-center">
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </div>
            )}
            <div className="space-y-6">{children}</div>
        </div>
    );
};

export default SectionContainer;
