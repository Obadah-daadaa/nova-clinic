import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AdminLayout from '@/layouts/admin-layout';
import AuthLayout from '@/layouts/auth-layout';
import PublicLayout from '@/layouts/public-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { hideSplashScreen } from '@/lib/splash';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('admin/'):
                return AdminLayout;
            case name.startsWith('settings/'):
                return [PublicLayout, SettingsLayout];
            default:
                return PublicLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        // Brand teal instead of the default grey; reads on both themes.
        // The delay keeps it from flashing on near-instant navigations.
        color: '#2dd4bf',
        delay: 150,
    },
});

// This will set light / dark mode on load...
initializeTheme();

// The splash covers the gap before hydration; once we're mounted it's noise.
hideSplashScreen();
