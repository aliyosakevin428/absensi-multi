import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, CalendarCheck2, Folder, LayoutGrid, PersonStanding, User2 } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'User Settings',
        href: route('user.index'),
        icon: PersonStanding,
    },
    {
        title: 'Team Settings',
        href: route('team.index'),
        icon: Folder,
    },
    {
        title: 'Position Settings',
        href: route('position.index'),
        icon: BookOpen,
    },
    {
        title: 'Absent Reason Settings',
        href: route('absent-reason.index'),
        icon: Folder,
    },
    {
        title: 'Event Type Settings',
        href: route('event-type.index'),
        icon: Folder,
    },
    {
        title: 'Acara / Kegiatan',
        href: route('event.index'),
        icon: CalendarCheck2,
    },
    {
        title: 'Kehadiran Anggota',
        href: route('attendance.index'),
        icon: User2,
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
