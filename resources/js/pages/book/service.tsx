import { Head } from '@inertiajs/react';
import { BookingStepper } from '@/components/nova/booking-stepper';
import { ServiceCard } from '@/components/nova/service-card';
import { useLang } from '@/hooks/use-lang';
import type { Service } from '@/types/clinic';

type PageProps = {
    services: Service[];
};

export default function BookService({ services }: PageProps) {
    const { t } = useLang();

    return (
        <>
            <Head title="Book an appointment" />

            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                <BookingStepper current={1} />

                <div className="mx-auto mt-10 mb-8 max-w-2xl text-center">
                    <h1 className="text-2xl font-semibold sm:text-3xl">
                        {t('booking.chooseService')}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {t('booking.chooseServiceSubtitle')}
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
