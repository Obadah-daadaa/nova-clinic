import { Head, Link, router } from '@inertiajs/react';
import { CalendarPlus, Clock, Stethoscope } from 'lucide-react';
import { StatusBadge } from '@/components/nova/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLang } from '@/hooks/use-lang';
import appointments from '@/routes/appointments';
import book from '@/routes/book';
import type { Booking } from '@/types/clinic';

type PageProps = {
    upcoming: Booking[];
    past: Booking[];
};

function BookingRow({ booking }: { booking: Booking }) {
    const { t, pick, locale } = useLang();

    const formatted = new Date(booking.starts_at).toLocaleString(
        locale === 'ar' ? 'ar-AE' : 'en-AE',
        {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        },
    );

    return (
        <Card>
            <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <Stethoscope className="mt-0.5 size-5 text-primary" />
                    <div>
                        <p className="font-medium">
                            {pick(booking.service.name, booking.service.name_ar)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {pick(booking.doctor.name, booking.doctor.name_ar)}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="size-3.5" />
                            {formatted}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <StatusBadge
                        status={booking.status}
                        label={booking.status_label}
                        labelAr={booking.status_label_ar}
                    />
                    {booking.can_be_cancelled && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                router.post(
                                    appointments.cancel({
                                        booking: booking.id,
                                    }).url,
                                )
                            }
                        >
                            {t('appointments.cancelButton')}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function Appointments({ upcoming, past }: PageProps) {
    const { t } = useLang();

    return (
        <>
            <Head title="My appointments" />

            <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="text-2xl font-semibold sm:text-3xl">
                            {t('appointments.title')}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {t('appointments.subtitle')}
                        </p>
                    </div>
                    <Button asChild className="gap-1.5 shrink-0">
                        <Link href={book.service()}>
                            <CalendarPlus className="size-4" />
                            {t('appointments.bookNew')}
                        </Link>
                    </Button>
                </div>

                <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase">
                        {t('appointments.upcoming')}
                    </h2>
                    {upcoming.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                            {t('appointments.noUpcoming')}
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {upcoming.map((booking) => (
                                <BookingRow key={booking.id} booking={booking} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-10 space-y-4">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase">
                        {t('appointments.past')}
                    </h2>
                    {past.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                            {t('appointments.noPast')}
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {past.map((booking) => (
                                <BookingRow key={booking.id} booking={booking} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
