import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Book, BookCheckIcon, BookCopy, BookOpen, BookOpenCheck, KeySquare, LayoutDashboardIcon, Newspaper, SwitchCamera, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
        icon: LayoutDashboardIcon,
    },
    // {
    //     title: 'Documentation',
    //     href: route('documentation'),
    //     icon: BookOpen,
    // },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { menus } = usePage<{ menus: Record<string, boolean> }>().props;

    return (
        <Sidebar collapsible="icon" variant="sidebar">
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

            <SidebarContent className="space-y-4">
                <NavMain
                    items={[
                        ...mainNavItems,
                        {
                            title: 'Daftar Anggota',
                            href: route('users.index'),
                            icon: Users,
                            available: menus.user,
                        },
                    ]}
                    label="Dashboard"
                />
                <NavMain
                    items={[
                        {
                            title: 'Acara/Kegiatan',
                            href: route('event.index'),
                            icon: BookOpen,
                            available: menus.event,
                        },
                        {
                            title: 'Jenis Acara',
                            href: route('event-type.index'),
                            icon: Book,
                            available: menus.eventType,
                        },
                        {
                            title: 'Daftar Kehadiran',
                            href: route('attendance.index'),
                            icon: BookOpenCheck,
                            available: menus.attendance,
                        },
                        {
                            title: 'Keterangan Kehadiran',
                            href: route('absent-reason.index'),
                            icon: BookCopy,
                            available: menus.absentReason,
                        },
                    ]}
                    label="Acara"
                />
                <NavMain
                    items={[
                        {
                            title: 'Position',
                            href: route('position.index'),
                            icon: SwitchCamera,
                            available: menus.position,
                        },
                        {
                            title: 'Team Lists',
                            href: route('team.index'),
                            icon: BookCheckIcon,
                            available: menus.team,
                        },
                        {
                            title: 'Artikel / Warta Jemaat',
                            href: route('news.index'),
                            icon: Newspaper,
                            available: menus.news,
                        },
                        {
                            title: 'Role & Permission',
                            href: route('role.index'),
                            icon: KeySquare,
                            available: menus.role,
                        },
                    ]}
                    label="Settings"
                />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
