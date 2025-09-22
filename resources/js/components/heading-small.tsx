import { ReactNode } from 'react';

type HeadingSmallProps = {
    title: string;
    description?: string;
    actions?: ReactNode; // 👈 ini ditambah
};

export default function HeadingSmall({ title, description, actions }: HeadingSmallProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2>{title}</h2>
                {description && <p>{description}</p>}
            </div>
            <div>{actions}</div> {/* 👈 render di sini */}
        </div>
    );
}
