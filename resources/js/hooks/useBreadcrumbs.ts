import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';

export function useBreadcrumbs(items: Omit<BreadcrumbItem, 'active'>[]): BreadcrumbItem[] {
    const { url } = usePage();

    return items.map((item) => ({
        ...item,
        active: url.startsWith(item.href), // aktif kalau url cocok
    }));
}
