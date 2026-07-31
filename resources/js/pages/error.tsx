import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Ban,
    Clock,
    Lock,
    SearchX,
    ServerCrash,
    Wrench,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { Button } from '@/components/ui/button';
import { useLang } from '@/hooks/use-lang';
import type { TranslationKey } from '@/lib/i18n';
import { home, login } from '@/routes';

type ErrorStatus = 401 | 403 | 404 | 419 | 429 | 500 | 503;

type Props = {
    status: number;
};

const CONFIG: Record<
    ErrorStatus,
    { icon: ComponentType<{ className?: string }>; title: TranslationKey; body: TranslationKey }
> = {
    401: { icon: Lock, title: 'error.401Title', body: 'error.401Body' },
    403: { icon: Ban, title: 'error.403Title', body: 'error.403Body' },
    404: { icon: SearchX, title: 'error.404Title', body: 'error.404Body' },
    419: { icon: Clock, title: 'error.419Title', body: 'error.419Body' },
    429: { icon: Clock, title: 'error.429Title', body: 'error.429Body' },
    500: { icon: ServerCrash, title: 'error.500Title', body: 'error.500Body' },
    503: { icon: Wrench, title: 'error.503Title', body: 'error.503Body' },
};

function ErrorPage({ status }: Props) {
    const { t } = useLang();
    const config = CONFIG[status as ErrorStatus] ?? CONFIG[500];
    const Icon = config.icon;
    const title = t(config.title);

    return (
        <>
            <Head title={`${status} — ${title}`} />

            <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:py-28">
                <span className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                    <Icon className="size-7" />
                </span>

                <p className="mt-6 font-mono text-sm font-semibold tracking-widest text-muted-foreground">
                    {status}
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                    {title}
                </h1>

                <p className="mt-3 text-balance text-muted-foreground">
                    {t(config.body)}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Button asChild>
                        <Link href={home()}>{t('error.goHome')}</Link>
                    </Button>

                    {status === 401 ? (
                        <Button asChild variant="outline">
                            <Link href={login()}>{t('error.signIn')}</Link>
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => window.history.back()}
                            className="gap-1.5"
                        >
                            <ArrowLeft className="size-4" />
                            {t('error.goBack')}
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}

// The layout is resolved centrally in app.tsx — pages outside auth/, admin/
// and settings/ get PublicLayout, so this page needs no layout of its own.
export default ErrorPage;
