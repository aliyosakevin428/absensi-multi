import { useSidebar } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';

export function CustomSidebarTrigger() {
    const { open, toggleSidebar } = useSidebar();

    return (
        <button onClick={toggleSidebar} className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-sidebar-accent">
            {open ? <Menu size={18} /> : <Menu size={18} />}
        </button>
    );
}
