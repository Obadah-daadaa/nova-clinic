import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/nova/status-badge';
import { Button } from '@/components/ui/button';
import {
    ToggleGroup,
    ToggleGroupItem,
} from '@/components/ui/toggle-group';
import { useLang } from '@/hooks/use-lang';
import admin from '@/routes/admin';
import type { Booking } from '@/types/clinic';

type CalendarView = 'day' | 'week' | 'month';

type Day = {
    date: string;
    label: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    bookings: Booking[];
};

type PageProps = {
    view: CalendarView;
    date: string;
    rangeLabel: string;
    prevDate: string;
    nextDate: string;
    today: string;
    days: Day[];
};

function BookingChip({ booking, locale }: { booking: Booking; locale: string }) {
    const { pick } = useLang();

    return (
        <li className="rounded-md bg-secondary/60 p-2 text-xs">
            <p className="font-medium">
                {new Date(booking.starts_at).toLocaleTimeString(
                    locale === 'ar' ? 'ar-AE' : 'en-AE',
                    { hour: '2-digit', minute: '2-digit' },
                )}{' '}
                — {booking.user.name}
            </p>
            <p className="text-muted-foreground">
                {pick(booking.service.name, booking.service.name_ar)} ·{' '}
                {pick(booking.doctor.name, booking.doctor.name_ar)}
            </p>
            <div className="mt-1">
                <StatusBadge
                    status={booking.status}
                    label={booking.status_label}
                    labelAr={booking.status_label_ar}
                />
            </div>
        </li>
    );
}

export default function AdminCalendar({
    view,
    rangeLabel,
    prevDate,
    nextDate,
    today,
    days,
}: PageProps) {
    const { t, locale } = useLang();

    const goTo = (nextView: CalendarView, nextDateValue: string) => {
        router.get(
            admin.calendar().url,
            { view: nextView, date: nextDateValue },
            { preserveState: true },
        );
    };

    return (
        <>
            <Head title="Admin — Calendar" />

            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <h1 className="text-2xl font-semibold sm:text-3xl">
                        {t('admin.calendarTitle')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {rangeLabel}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <ToggleGroup
                        type="single"
                        value={view}
                        onValueChange={(value) =>
                            value && goTo(value as CalendarView, today)
                        }
                        variant="outline"
                    >
                        <ToggleGroupItem value="day">
                            {t('admin.viewDay')}
                        </ToggleGroupItem>
                        <ToggleGroupItem value="week">
                            {t('admin.viewWeek')}
                        </ToggleGroupItem>
                        <ToggleGroupItem value="month">
                            {t('admin.viewMonth')}
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => goTo(view, prevDate)}
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goTo(view, today)}
                        >
                            {t('admin.today')}
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => goTo(view, nextDate)}
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {view === 'month' ? (
                <div className="grid grid-cols-7 gap-2">
                    {days.map((day) => (
                        <div
                            key={day.date}
                            className={`min-h-28 rounded-lg border p-2 ${
                                day.isCurrentMonth
                                    ? 'border-border'
                                    : 'border-border/40 bg-muted/30'
                            } ${day.date === today ? 'ring-2 ring-primary' : ''}`}
                        >
                            <p
                                className={`mb-1 text-xs font-semibold ${
                                    day.isCurrentMonth
                                        ? ''
                                        : 'text-muted-foreground'
                                }`}
                            >
                                {day.dayNumber}
                            </p>
                            <ul className="space-y-1">
                                {day.bookings.slice(0, 3).map((booking) => (
                                    <li
                                        key={booking.id}
                                        className="truncate rounded bg-secondary/60 px-1.5 py-0.5 text-[11px]"
                                    >
                                        {new Date(
                                            booking.starts_at,
                                        ).toLocaleTimeString(
                                            locale === 'ar' ? 'ar-AE' : 'en-AE',
                                            { hour: '2-digit', minute: '2-digit' },
                                        )}{' '}
                                        {booking.user.name}
                                    </li>
                                ))}
                                {day.bookings.length > 3 && (
                                    <li className="text-[11px] text-muted-foreground">
                                        +{day.bookings.length - 3}{' '}
                                        {t('admin.more')}
                                    </li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : view === 'day' ? (
                <div className="max-w-md">
                    {days.map((day) => (
                        <div
                            key={day.date}
                            className="rounded-lg border border-border p-3"
                        >
                            {day.bookings.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    {t('admin.noBookingsDay')}
                                </p>
                            ) : (
                                <ul className="space-y-2">
                                    {day.bookings.map((booking) => (
                                        <BookingChip
                                            key={booking.id}
                                            booking={booking}
                                            locale={locale}
                                        />
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-3 md:grid-cols-7">
                    {days.map((day) => (
                        <div
                            key={day.date}
                            className={`min-h-40 rounded-lg border p-3 ${
                                day.date === today
                                    ? 'border-primary ring-1 ring-primary'
                                    : 'border-border'
                            }`}
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
                                        <BookingChip
                                            key={booking.id}
                                            booking={booking}
                                            locale={locale}
                                        />
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
