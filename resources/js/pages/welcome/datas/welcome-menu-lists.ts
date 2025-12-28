import { NavItem } from '@/types';
import { Home, Info, Newspaper, ScrollText } from 'lucide-react';

export const welcomeMenuList: NavItem[] = [
    {
        title: 'Homepage',
        href: route('home'),
        icon: Home,
    },
    {
        title: 'About Us',
        href: route('about'),
        icon: Info,
    },
    {
        title: 'Artikel',
        href: route('berita'),
        icon: Newspaper,
    },
    {
        title: 'Warta Jemaat',
        href: route('warta.index'),
        icon: ScrollText,
    },
];
