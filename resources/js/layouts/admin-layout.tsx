import type { PropsWithChildren } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { useFlashMessages } from '@/hooks/use-flash-messages';
import { LangProvider } from '@/hooks/use-lang';
import type { BreadcrumbItem } from '@/types';

function AdminLayoutInner({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    useFlashMessages();

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </AppContent>
        </AppShell>
    );
}

export default function AdminLayout({
    children,
    breadcrumbs,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <LangProvider>
            <AdminLayoutInner breadcrumbs={breadcrumbs}>
                {children}
            </AdminLayoutInner>
        </LangProvider>
    );
}
