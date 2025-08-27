import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const em = (e: { [key: string]: string }) => {
    return Object.entries(e)
        .map(([, v]) => v)
        .join(', ');
};
