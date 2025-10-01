import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { FC, PropsWithChildren } from 'react';
import WelcomeFooter from '../components/welcome-footer';
import WelcomeNavbar from '../components/welcome-navbar';
import WelcomeSidebar from '../components/welcome-sidebar';

type Props = PropsWithChildren;

const WelcomeLayout: FC<Props> = ({ children }) => {
    // const isOpen = usePage<SharedData>().props.sidebarOpen;

    return (
        <SidebarProvider defaultOpen={false}>
            <WelcomeSidebar />
            <SidebarInset>
                <div className="mx-auto grid w-full max-w-7xl space-y-6 px-6">
                    <WelcomeNavbar />
                    {children}
                    <WelcomeFooter />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default WelcomeLayout;
