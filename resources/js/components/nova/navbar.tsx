import { Link, router, usePage } from '@inertiajs/react';
import { CalendarDays, LayoutGrid, LogOut, Menu, Settings } from 'lucide-react';
import { useState } from 'react';
import { LangToggle } from '@/components/nova/lang-toggle';
import { NovaLogo } from '@/components/nova/logo';
import { ThemeToggle } from '@/components/nova/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { useLang } from '@/hooks/use-lang';
import { login, logout, register } from '@/routes';
import admin from '@/routes/admin';
import appointments from '@/routes/appointments';
import book from '@/routes/book';
import doctors from '@/routes/doctors';
import { edit as editProfile } from '@/routes/profile';
import services from '@/routes/services';
import type { MaybeAuth } from '@/types';

export function Navbar() {
    const { t, dir } = useLang();
    const { auth } = usePage<{ auth: MaybeAuth }>().props;
    const getInitials = useInitials();
    const [mobileOpen, setMobileOpen] = useState(false);
    const user = auth?.user ?? null;

    const navLinks = [
        { href: '/', label: t('nav.home') },
        { href: services.index(), label: t('nav.services') },
        { href: doctors.index(), label: t('nav.doctors') },
    ];

    return (
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <NovaLogo />

                <nav className="hidden items-center gap-6 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                    {user && (
                        <Link
                            href={appointments.index()}
                            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                        >
                            {t('nav.myAppointments')}
                        </Link>
                    )}
                    {user?.is_admin && (
                        <Link
                            href={admin.bookings.index()}
                            className="flex items-center gap-1 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                        >
                            <LayoutGrid className="size-3.5" />
                            {t('nav.adminBookings')}
                        </Link>
                    )}
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    <LangToggle />
                    <ThemeToggle />

                    <Button asChild size="sm" className="ms-1 gap-1.5">
                        <Link href={book.service()}>
                            <CalendarDays className="size-4" />
                            {t('nav.bookAppointment')}
                        </Link>
                    </Button>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                >
                                    <Avatar className="size-8">
                                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56"
                            >
                                <UserMenuContent user={user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-1">
                            <Button asChild variant="ghost" size="sm">
                                <Link href={login()}>{t('nav.login')}</Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href={register()}>
                                    {t('nav.register')}
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                        >
                            <Menu className="size-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side={dir === 'rtl' ? 'left' : 'right'}
                        className="w-72"
                    >
                        <SheetHeader>
                            <SheetTitle>
                                <NovaLogo />
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-1 px-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {user && (
                                <Link
                                    href={appointments.index()}
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                                >
                                    {t('nav.myAppointments')}
                                </Link>
                            )}
                            {user?.is_admin && (
                                <Link
                                    href={admin.bookings.index()}
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                                >
                                    {t('nav.adminBookings')}
                                </Link>
                            )}

                            <Button asChild className="mt-3 gap-1.5">
                                <Link
                                    href={book.service()}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <CalendarDays className="size-4" />
                                    {t('nav.bookAppointment')}
                                </Link>
                            </Button>

                            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                                <LangToggle />
                                <ThemeToggle />
                            </div>

                            {user ? (
                                <div className="mt-2 flex flex-col gap-1 border-t border-border pt-2">
                                    <Link
                                        href={editProfile()}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                                    >
                                        <Settings className="size-4" />
                                        Settings
                                    </Link>
                                    <Link
                                        href={logout()}
                                        as="button"
                                        onClick={() => {
                                            setMobileOpen(false);
                                            router.flushAll();
                                        }}
                                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-start text-sm font-medium hover:bg-accent"
                                    >
                                        <LogOut className="size-4" />
                                        Log out
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-2 flex flex-col gap-2">
                                    <Button asChild variant="outline">
                                        <Link href={login()}>
                                            {t('nav.login')}
                                        </Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={register()}>
                                            {t('nav.register')}
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
