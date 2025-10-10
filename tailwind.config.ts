import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./resources/**/*.blade.php', './resources/**/*.tsx', './resources/**/*.ts'],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        color: 'hsl(var(--foreground))',
                        h1: { color: 'hsl(var(--foreground))' },
                        h2: { color: 'hsl(var(--foreground))' },
                        h3: { color: 'hsl(var(--foreground))' },
                        h4: { color: 'hsl(var(--foreground))' },
                        strong: { color: 'hsl(var(--foreground))' },
                        a: { color: 'hsl(var(--foreground))' },
                    },
                },
                invert: {
                    css: {
                        color: 'hsl(var(--foreground))',
                        h1: { color: 'hsl(var(--foreground))' },
                        h2: { color: 'hsl(var(--foreground))' },
                        h3: { color: 'hsl(var(--foreground))' },
                        h4: { color: 'hsl(var(--foreground))' },
                        strong: { color: 'hsl(var(--foreground))' },
                        a: { color: 'hsl(var(--foreground))' },
                    },
                },
            },
        },
    },
    // plugins: [typography],
};

export default config;
