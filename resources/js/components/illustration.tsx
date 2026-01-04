import clsx from 'clsx';
import { useEffect, useState } from 'react';

type IllustrationVariant = 'primary' | 'muted' | 'subtle';

interface IllustrationProps {
    src: string;
    variant?: IllustrationVariant;
    className?: string;
}

const variantClasses: Record<IllustrationVariant, string> = {
    primary: 'text-primary',
    muted: 'text-muted-foreground',
    subtle: 'text-muted-foreground/60',
};

export default function Illustration({ src, variant = 'primary', className = '' }: IllustrationProps) {
    const [svg, setSvg] = useState('');

    useEffect(() => {
        fetch(src)
            .then((res) => res.text())
            .then(setSvg);
    }, [src]);

    if (!svg) return null;

    return (
        <div
            aria-hidden
            className={clsx('mx-auto [&>svg]:h-auto [&>svg]:w-full', variantClasses[variant], className)}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
