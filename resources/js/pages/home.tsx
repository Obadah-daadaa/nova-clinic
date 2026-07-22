import { Head, Link } from '@inertiajs/react';
import { CalendarCheck, Globe2, ShieldCheck, Sparkles } from 'lucide-react';
import { DoctorCard } from '@/components/nova/doctor-card';
import { ServiceCard } from '@/components/nova/service-card';
import { Button } from '@/components/ui/button';
import { useLang } from '@/hooks/use-lang';
import book from '@/routes/book';
import doctors from '@/routes/doctors';
import services from '@/routes/services';
import type { Doctor, Service } from '@/types/clinic';

type PageProps = {
    services: Service[];
    doctors: Doctor[];
};

const stats = [
    { key: 'home.statsPatients', value: '12,000+' },
    { key: 'home.statsDoctors', value: '4' },
    { key: 'home.statsYears', value: '10+' },
    { key: 'home.statsRating', value: '4.9/5' },
] as const;

export default function Home({ services: allServices, doctors: allDoctors }: PageProps) {
    const { t } = useLang();

    return (
        <>
            <Head title="Nova Clinic — Book your appointment online" />

            <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent/40 to-background">
                <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
                    <div className="space-y-6">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-medium text-gold-foreground">
                            <Sparkles className="size-3.5" />
                            {t('home.heroEyebrow')}
                        </span>
                        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                            {t('home.heroTitle')}
                        </h1>
                        <p className="max-w-lg text-lg text-muted-foreground">
                            {t('home.heroSubtitle')}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild size="lg" className="gap-2">
                                <Link href={book.service()}>
                                    <CalendarCheck className="size-5" />
                                    {t('home.heroCta')}
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href={services.index()}>
                                    {t('home.heroSecondaryCta')}
                                </Link>
                            </Button>
                        </div>

                        <dl className="grid grid-cols-2 gap-6 pt-6 sm:grid-cols-4">
                            {stats.map((stat) => (
                                <div key={stat.key}>
                                    <dt className="text-2xl font-semibold text-primary">
                                        {stat.value}
                                    </dt>
                                    <dd className="text-xs text-muted-foreground">
                                        {t(stat.key)}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="relative hidden aspect-square items-center justify-center lg:flex">
                        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/15 to-gold/20 blur-2xl" />
                        <div className="relative flex size-full max-w-md items-center justify-center rounded-3xl border border-border/60 bg-card/80 p-10 shadow-xl backdrop-blur">
                            <div className="space-y-4 text-center">
                                <ShieldCheck className="mx-auto size-12 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    {t('home.statsRating')}
                                </p>
                                <p className="text-3xl font-semibold" dir="ltr">
                                    4.9 / 5
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div>
                        <h2 className="text-2xl font-semibold">
                            {t('home.servicesTitle')}
                        </h2>
                        <p className="mt-1 max-w-xl text-muted-foreground">
                            {t('home.servicesSubtitle')}
                        </p>
                    </div>
                    <Button asChild variant="ghost" className="shrink-0">
                        <Link href={services.index()}>
                            {t('home.viewAllServices')}
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {allServices.slice(0, 3).map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </section>

            <section className="border-y border-border bg-secondary/30">
                <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                    <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                {t('home.doctorsTitle')}
                            </h2>
                            <p className="mt-1 max-w-xl text-muted-foreground">
                                {t('home.doctorsSubtitle')}
                            </p>
                        </div>
                        <Button asChild variant="ghost" className="shrink-0">
                            <Link href={doctors.index()}>
                                {t('home.viewAllDoctors')}
                            </Link>
                        </Button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {allDoctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                <h2 className="mb-10 text-center text-2xl font-semibold">
                    {t('home.whyTitle')}
                </h2>
                <div className="grid gap-8 sm:grid-cols-3">
                    <div className="space-y-3 text-center">
                        <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                            <CalendarCheck className="size-6" />
                        </span>
                        <h3 className="font-semibold">{t('home.why1Title')}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t('home.why1Body')}
                        </p>
                    </div>
                    <div className="space-y-3 text-center">
                        <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                            <Globe2 className="size-6" />
                        </span>
                        <h3 className="font-semibold">{t('home.why2Title')}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t('home.why2Body')}
                        </p>
                    </div>
                    <div className="space-y-3 text-center">
                        <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                            <ShieldCheck className="size-6" />
                        </span>
                        <h3 className="font-semibold">{t('home.why3Title')}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t('home.why3Body')}
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
                <div className="rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground">
                    <h2 className="text-2xl font-semibold sm:text-3xl">
                        {t('home.ctaTitle')}
                    </h2>
                    <p className="mx-auto mt-3 max-w-lg text-primary-foreground/85">
                        {t('home.ctaSubtitle')}
                    </p>
                    <Button
                        asChild
                        size="lg"
                        variant="secondary"
                        className="mt-6"
                    >
                        <Link href={book.service()}>{t('home.ctaButton')}</Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
