import { NavItem } from '@/types';
import { Home, Newspaper, UserSquare } from 'lucide-react';

export const welcomeMenuList: NavItem[] = [
    {
        title: 'Homepage',
        href: route('home'),
        icon: Home,
    },
    {
        title: 'About Us',
        href: route('about'),
        icon: UserSquare,
    },
    {
        title: 'Berita Terbaru',
        href: route('berita'),
        icon: Newspaper,
    }
];
