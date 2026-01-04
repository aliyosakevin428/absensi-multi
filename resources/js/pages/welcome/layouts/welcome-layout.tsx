import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
// import { SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import { FC, PropsWithChildren } from 'react';
import WelcomeFooter from '../components/welcome-footer';
import WelcomeNavbar from '../components/welcome-navbar';
import WelcomeSidebar from '../components/welcome-sidebar';

type Props = PropsWithChildren;

const WelcomeLayout: FC<Props> = ({ children }) => {
    // const isOpen = usePage<SharedData>().props.sidebarOpen;

    // const { name } = usePage<SharedData>().props;

    return (
        <SidebarProvider defaultOpen={false}>
            <WelcomeSidebar />
            <Head>
                <title>Multimedia Official</title>
                <link rel="icon" type="image/x-icon" href="/images/logo-channel.png" />
            </Head>
            <SidebarInset>
                <div className="mx-auto grid w-full max-w-7xl space-y-1 px-2">
                    <WelcomeNavbar />
                    {children}
                    <WelcomeFooter />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default WelcomeLayout;
