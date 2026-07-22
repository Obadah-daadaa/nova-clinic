import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/nova/status-badge';
import { Button } from '@/components/ui/button';
import { useLang } from '@/hooks/use-lang';
import admin from '@/routes/admin';
import type { Booking } from '@/types/clinic';

type Day = {
    date: string;
    label: string;
    bookings: Booking[];
};

type PageProps = {
    weekStart: string;
    prevWeek: string;
    nextWeek: string;
    days: Day[];
};

export default function AdminCalendar({ prevWeek, nextWeek, days }: PageProps) {
    const { t, pick, locale } = useLang();

    const goToWeek = (week: string) => {
        router.get(admin.calendar().url, { week }, { preserveState: true });
    };

    return (
        <>
            <Head title="Admin — Calendar" />

            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="text-2xl font-semibold sm:text-3xl">
                            {t('admin.calendarTitle')}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {t('admin.calendarSubtitle')}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => goToWeek(prevWeek)}
                        >
                            <ChevronLeft className="size-4" />
                            {t('admin.prevWeek')}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => goToWeek(nextWeek)}
                        >
                            {t('admin.nextWeek')}
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid gap-3 md:grid-cols-7">
                    {days.map((day) => (
                        <div
                            key={day.date}
                            className="min-h-40 rounded-lg border border-border p-3"
                        >
                            <p className="mb-2 text-sm font-semibold">
                                {day.label}
                            </p>
                            {day.bookings.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                    {t('admin.noBookingsDay')}
                                </p>
                            ) : (
                                <ul className="space-y-2">
                                    {day.bookings.map((booking) => (
                                        <li
                                            key={booking.id}
                                            className="rounded-md bg-secondary/60 p-2 text-xs"
                                        >
                                            <p className="font-medium">
                                                {new Date(
                                                    booking.starts_at,
                                                ).toLocaleTimeString(
                                                    locale === 'ar'
                                                        ? 'ar-AE'
                                                        : 'en-AE',
                                                    {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    },
                                                )}{' '}
                                                — {booking.user.name}
                                            </p>
                                            <p className="text-muted-foreground">
                                                {pick(
                                                    booking.service.name,
                                                    booking.service.name_ar,
                                                )}{' '}
                                                ·{' '}
                                                {pick(
                                                    booking.doctor.name,
                                                    booking.doctor.name_ar,
                                                )}
                                            </p>
                                            <div className="mt-1">
                                                <StatusBadge
                                                    status={booking.status}
                                                    label={booking.status_label}
                                                    labelAr={
                                                        booking.status_label_ar
                                                    }
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
