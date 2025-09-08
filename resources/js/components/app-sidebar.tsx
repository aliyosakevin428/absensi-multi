import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookCheck, BookOpen, CalendarArrowUp, Folder, Layers, LayoutGrid, LocateFixed, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Daftar Anggota',
        href: route('users.index'),
        icon: Users,
    },
    {
        title: 'Daftar Tim',
        href: route('team.index'),
        icon: Layers,
    },
    {
        title: 'Acara / Kegiatan',
        href: route('event.index'),
        icon: LocateFixed,
    },
    {
        title: 'Jenis Acara',
        href: route('event-type.index'),
        icon: Folder,
    },
    {
        title: 'Kehadiran Anggota',
        href: route('attendance.index'),
        icon: CalendarArrowUp,
    },
];

const settingsNavItems: NavItem[] = [
    {
        title: 'Position Settings',
        href: route('position.index'),
        icon: BookOpen,
    },
    {
        title: 'Absent Reason Settings',
        href: route('absent-reason.index'),
        icon: BookCheck,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Bagian Menu Utama */}
                <div className="mt-1 px-2">
                    <p className="mb-2 px-2 text-xs font-semibold text-gray-500">Menu Utama</p>
                    <NavMain items={mainNavItems} />
                </div>

                {/* Bagian Master Data / Settings */}
                <div className="mt-6 px-2">
                    <p className="mb-2 px-2 text-xs font-semibold text-gray-500">Settings</p>
                    <NavMain items={settingsNavItems} />
                </div>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
