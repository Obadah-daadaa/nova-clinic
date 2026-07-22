import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, CalendarClock, Stethoscope, Wallet } from 'lucide-react';
import BookingController from '@/actions/App/Http/Controllers/Booking/BookingController';
import InputError from '@/components/input-error';
import { BookingStepper } from '@/components/nova/booking-stepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLang } from '@/hooks/use-lang';
import book from '@/routes/book';
import type { Doctor, Service } from '@/types/clinic';

type PageProps = {
    service: Service;
    doctor: Doctor;
    starts_at: string;
};

export default function BookConfirm({ service, doctor, starts_at }: PageProps) {
    const { t, pick, locale } = useLang();

    const formattedDateTime = new Date(starts_at).toLocaleString(
        locale === 'ar' ? 'ar-AE' : 'en-AE',
        {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        },
    );

    return (
        <>
            <Head title="Confirm your appointment" />

            <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
                <BookingStepper current={4} />

                <div className="mx-auto mt-10 mb-8 max-w-lg text-center">
                    <h1 className="text-2xl font-semibold sm:text-3xl">
                        {t('booking.confirmTitle')}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {t('booking.confirmSubtitle')}
                    </p>
                </div>

                <Card>
                    <CardContent className="space-y-4 pt-6">
                        <div className="flex items-start gap-3">
                            <Stethoscope className="mt-0.5 size-5 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    {t('booking.summaryService')}
                                </p>
                                <p className="font-medium">
                                    {pick(service.name, service.name_ar)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {pick(doctor.name, doctor.name_ar)} —{' '}
                                    {pick(doctor.title, doctor.title_ar)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <CalendarClock className="mt-0.5 size-5 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    {t('booking.summaryDateTime')}
                                </p>
                                <p className="font-medium">{formattedDateTime}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Wallet className="mt-0.5 size-5 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    {t('booking.summaryPrice')}
                                </p>
                                <p className="font-medium">
                                    {service.price} {t('common.aed')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Form
                    {...BookingController.store.form()}
                    className="mt-6 space-y-3"
                >
                    {({ processing, errors }) => (
                        <>
                            <input
                                type="hidden"
                                name="service_id"
                                value={service.id}
                            />
                            <input
                                type="hidden"
                                name="doctor_id"
                                value={doctor.id}
                            />
                            <input
                                type="hidden"
                                name="starts_at"
                                value={starts_at}
                            />

                            <InputError message={errors.starts_at} />
                            <InputError message={errors.doctor_id} />

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={processing}
                            >
                                {t('booking.confirmButton')}
                            </Button>
                        </>
                    )}
                </Form>

                <div className="mt-6 text-center">
                    <Button asChild variant="ghost">
                        <Link
                            href={book.slot({
                                query: { service: service.id, doctor: doctor.id },
                            })}
                            className="gap-1.5"
                        >
                            <ArrowLeft className="size-4" />
                            {t('booking.backToSlots')}
                        </Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
