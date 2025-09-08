import Heading from '@/components/heading';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { PropsWithChildren, type ReactNode } from 'react';
import { Toaster } from 'sonner';

type AppLayoutProps = PropsWithChildren & {
    title?: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: ReactNode;
};

export default ({
    children,
    breadcrumbs = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
    ],
    title = 'Page Heading',
    description = 'Page description',
    actions,
}: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs}>
        <Head title={title} />
        <div className="flex h-full flex-1 flex-col gap-4 space-y-1 overflow-x-auto rounded-xl p-5">
            <div className="flex items-start justify-between">
                <Heading title={title} description={description} />
                {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
            </div>
            {children}
        </div>
        <Toaster position="top-center" />
    </AppLayoutTemplate>
);
