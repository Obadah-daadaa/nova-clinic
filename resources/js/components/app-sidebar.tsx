import { Link } from '@inertiajs/react';
import { CalendarRange, LayoutGrid, Stethoscope, Syringe } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useLang } from '@/hooks/use-lang';
import admin from '@/routes/admin';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { t } = useLang();

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
                                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Stethoscope className="size-4.5" />
                                </span>
                                <span className="ml-1 grid flex-1 text-left text-sm">
                                    <span className="truncate leading-tight font-semibold">
                                        Nova Clinic
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
