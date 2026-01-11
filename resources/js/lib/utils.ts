import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import { Area } from 'react-easy-crop';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const em = (e: { [key: string]: string }) => {
    return Object.entries(e)
        .map(([, v]) => v)
        .join(', ');
};

export function capitalizeWords(str: string): string {
    return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
    return array.reduce(
        (acc, item) => {
            const groupKey = String(item[key]);
            if (!acc[groupKey]) {
                acc[groupKey] = [];
            }
            acc[groupKey].push(item);
            return acc;
        },
        {} as Record<string, T[]>,
    );
}

export function dateDFY(date: string | Date) {
    return dayjs(date).format('DD MMMM YYYY');
}

export function dateDFYHIS(date: string | Date) {
    return dayjs(date).format('DD MMMM YYYY HH:mm:ss');
}

export function strLimit(text: string | null | undefined, limit: number = 50, end: string = '...'): string {
    if (!text) return ''; // kalau null/undefined/empty string
    if (text.length <= limit) return text;
    return text.slice(0, limit - end.length) + end;
}

export function generateSlug(text: string): string {
    const slugBase = text.replace(/\//g, '');
    return slugBase.toLowerCase().replace(/\s+/g, '-');
}

export function copyMarkdownImage(alt: string, url: string) {
    const markdown = `![${alt}](${url})`;

    navigator.clipboard
        .writeText(markdown)
        .then(() => toast.success(`${alt} copied to clipboard`))
        .catch((err) => toast.error(err));
}

export function handlePasteScreenshot(callback: (file: File) => void) {
    const onPaste = (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (const item of items) {
            if (item.type.startsWith('image')) {
                const file = item.getAsFile();
                if (file) {
                    callback(file);
                }
            }
        }
    };

    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste); // biar bisa cleanup
}

export default function getCroppedImage(imageSrc: string, crop: Area): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;

        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = crop.width;
            canvas.height = crop.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas context not available'));
                return;
            }

            ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Failed to create blob'));
                },
                'image/jpeg',
                0.9,
            );
        };

        image.onerror = () => {
            reject(new Error('Failed to load image'));
        };
    });
}
