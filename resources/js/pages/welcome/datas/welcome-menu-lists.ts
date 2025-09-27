import { NavItem } from '@/types';
import { Home, Info, Newspaper } from 'lucide-react';

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
        title: 'Berita Terbaru',
        href: route('berita'),
        icon: Newspaper,
    },
];
