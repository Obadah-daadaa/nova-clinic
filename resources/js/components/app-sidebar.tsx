import { Link } from '@inertiajs/react';
import { CalendarRange, LayoutGrid, Stethoscope, Syringe } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { BrandMark } from '@/components/nova/brand-mark';
import { SidebarLangToggle } from '@/components/nova/sidebar-lang-toggle';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useBranding } from '@/hooks/use-branding';
import { useLang } from '@/hooks/use-lang';
import admin from '@/routes/admin';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { t } = useLang();
    const { name: brandName } = useBranding();

    const mainNavItems: NavItem[] = [
        {
            title: t('admin.navBookings'),
            href: admin.bookings.index(),
            icon: LayoutGrid,
        },
        {
            title: t('admin.navCalendar'),
            href: admin.calendar(),
            icon: CalendarRange,
        },
        {
            title: t('admin.navDoctors'),
            href: admin.doctors.index(),
            icon: Stethoscope,
        },
        {
            title: t('admin.navServices'),
            href: admin.services.index(),
            icon: Syringe,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={admin.bookings.index()}>
                                <BrandMark />
                                <span className="ml-1 grid flex-1 text-left text-sm">
                                    <span className="truncate leading-tight font-semibold">
                                        {brandName}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {t('admin.sidebarLabel')}
                                    </span>
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <SidebarLangToggle />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
