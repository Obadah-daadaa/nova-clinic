import { Link } from '@inertiajs/react';
import { MapPin, Clock } from 'lucide-react';
import { NovaLogo } from '@/components/nova/logo';
import { useLang } from '@/hooks/use-lang';
import doctors from '@/routes/doctors';
import services from '@/routes/services';

export function Footer() {
    const { t } = useLang();

    return (
        <footer className="border-t border-border bg-secondary/40">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
                <div className="space-y-3">
                    <NovaLogo />
                    <p className="max-w-xs text-sm text-muted-foreground">
                        {t('footer.tagline')}
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold">
                        {t('footer.quickLinks')}
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            <Link
                                href="/"
                                className="hover:text-foreground"
                            >
                                {t('nav.home')}
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={services.index()}
                                className="hover:text-foreground"
                            >
                                {t('nav.services')}
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={doctors.index()}
                                className="hover:text-foreground"
                            >
                                {t('nav.doctors')}
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold">
                        {t('footer.contact')}
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <MapPin className="mt-0.5 size-4 shrink-0" />
                            <span>{t('footer.address')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Clock className="mt-0.5 size-4 shrink-0" />
                            <span>
                                {t('footer.hours')}: {t('footer.hoursValue')}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-border">
                <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
                    &copy; {new Date().getFullYear()} Nova Clinic —{' '}
                    {t('footer.rights')}
                </div>
            </div>
        </footer>
    );
}
