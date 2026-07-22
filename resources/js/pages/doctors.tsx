import { Head } from '@inertiajs/react';
import { DoctorCard } from '@/components/nova/doctor-card';
import { useLang } from '@/hooks/use-lang';
import type { Doctor } from '@/types/clinic';

type PageProps = {
    doctors: Doctor[];
};

export default function Doctors({ doctors }: PageProps) {
    const { t } = useLang();

    return (
        <>
            <Head title="Our Doctors" />

            <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                <div className="mb-10 max-w-2xl">
                    <h1 className="text-3xl font-semibold">
                        {t('doctors.title')}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {t('doctors.subtitle')}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {doctors.map((doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                </div>
            </section>
        </>
    );
}
