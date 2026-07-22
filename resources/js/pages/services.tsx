import { Head } from '@inertiajs/react';
import { ServiceCard } from '@/components/nova/service-card';
import { useLang } from '@/hooks/use-lang';
import type { Service } from '@/types/clinic';

type PageProps = {
    services: Service[];
};

export default function Services({ services }: PageProps) {
    const { t } = useLang();

    return (
        <>
            <Head title="Services" />

            <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                <div className="mb-10 max-w-2xl">
                    <h1 className="text-3xl font-semibold">
                        {t('services.title')}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {t('services.subtitle')}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </section>
        </>
    );
}
