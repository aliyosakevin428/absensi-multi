import ThemeToggler from '@/components/theme-toggler';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import { welcomeMenuList } from '../datas/welcome-menu-lists';

const WelcomeNavbar = () => {
    const { auth } = usePage<SharedData>().props;
    const isMobile = useIsMobile();

    return (
        <div className="flex h-fit items-center justify-between py-6">
            {isMobile ? (
                <SidebarTrigger />
            ) : (
                <nav className="flex w-full items-center justify-between gap-5">
                    <div className="flex items-center gap-6">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <img src="/images/logo-channel.png" alt="Logo" className="h-12 w-auto" />
                            {/* <span className="text-md font-semibold tracking-tight">Multimedia Official</span> */}
                        </Link>

                        <div className="flex items-center gap-3">
                            {welcomeMenuList.map((menu, index) => (
                                <Button variant={menu.isActive ? 'outline' : 'ghost'} key={index} asChild>
                                    <Link href={menu.href} className="flex items-center gap-1">
                                        {menu.icon && <menu.icon className="h-4 w-4" />}
                                        {menu.title}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <ThemeToggler width="fit" />
                        {[
                            ...(auth.user
                                ? [
                                      {
                                          title: 'Dashboard',
                                          href: route('dashboard'),
                                          icon: LogIn,
                                      },
                                  ]
                                : [
                                      {
                                          title: 'Log in',
                                          href: route('login'),
                                          icon: LogIn,
                                          isActive: true,
                                      },
                                  ]),
                        ].map((menu, index) => (
                            <Button variant={menu.isActive ? 'outline' : 'ghost'} key={index} asChild>
                                <Link href={menu.href}>
                                    {menu.icon && <menu.icon />}
                                    {menu.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </nav>
            )}
        </div>
    );
};

export default WelcomeNavbar;
