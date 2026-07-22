import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { BookingStepper } from '@/components/nova/booking-stepper';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
import { useLang } from '@/hooks/use-lang';
import book from '@/routes/book';
import type { Doctor, Service } from '@/types/clinic';

type PageProps = {
    service: Service;
    doctors: Doctor[];
};

export default function BookDoctor({ service, doctors }: PageProps) {
    const { t, pick } = useLang();
    const getInitials = useInitials();

    return (
        <>
            <Head title="Choose a doctor" />

            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                <BookingStepper current={2} />

                <div className="mx-auto mt-10 mb-8 max-w-2xl text-center">
                    <h1 className="text-2xl font-semibold sm:text-3xl">
                        {t('booking.chooseDoctor')}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {t('booking.chooseDoctorSubtitle')}
                    </p>
                    <p className="mt-1 text-sm font-medium text-primary">
                        {pick(service.name, service.name_ar)}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {doctors.map((doctor) => (
                        <Card key={doctor.id}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-base font-semibold text-secondary-foreground">
                                        {getInitials(doctor.name)}
                                    </span>
                                    <div>
                                        <CardTitle className="text-base">
                                            {pick(doctor.name, doctor.name_ar)}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {pick(doctor.title, doctor.title_ar)}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            {doctor.bio && (
                                <CardContent>
                                    <p className="line-clamp-3 text-sm text-muted-foreground">
                                        {pick(doctor.bio, doctor.bio_ar ?? doctor.bio)}
                                    </p>
                                </CardContent>
                            )}
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link
                                        href={book.slot({
                                            query: {
                                                service: service.id,
                                                doctor: doctor.id,
                                            },
                                        })}
                                    >
                                        {t('doctors.bookButton')}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <Button asChild variant="ghost">
                        <Link href={book.service()} className="gap-1.5">
                            <ArrowLeft className="size-4" />
                            {t('booking.backToServices')}
                        </Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
