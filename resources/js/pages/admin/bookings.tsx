import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/nova/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useLang } from '@/hooks/use-lang';
import admin from '@/routes/admin';
import type { Booking, BookingStatusValue } from '@/types/clinic';

type PageProps = {
    bookings: {
        data: Booking[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        status: BookingStatusValue | null;
        date: string | null;
    };
    statuses: { value: BookingStatusValue; label: string }[];
};

const ALL = '__all__';

function nextActions(status: BookingStatusValue): BookingStatusValue[] {
    switch (status) {
        case 'pending':
            return ['confirmed', 'cancelled'];
        case 'confirmed':
            return ['completed', 'no_show', 'cancelled'];
        default:
            return [];
    }
}

export default function AdminBookings({ bookings, filters, statuses }: PageProps) {
    const { t, pick, locale } = useLang();

    const updateFilters = (next: Partial<{ status: string; date: string }>) => {
        router.get(
            admin.bookings.index().url,
            {
                status: next.status ?? filters.status ?? undefined,
                date: next.date ?? filters.date ?? undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const setStatus = (booking: Booking, status: BookingStatusValue) => {
        router.patch(admin.bookings.update({ booking: booking.id }).url, {
            status,
        });
    };

    const actionLabels: Record<BookingStatusValue, string> = {
        pending: t('admin.actionConfirm'),
        confirmed: t('admin.actionComplete'),
        completed: t('admin.actionComplete'),
        cancelled: t('admin.actionCancel'),
        no_show: t('admin.actionNoShow'),
    };

    return (
        <>
            <Head title="Admin — Bookings" />

            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold sm:text-3xl">
                        {t('admin.bookingsTitle')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {t('admin.bookingsSubtitle')}
                    </p>
                </div>

                <div className="mb-6 flex flex-wrap items-end gap-3">
                    <div className="w-48 space-y-1.5">
                        <label className="text-xs text-muted-foreground">
                            {t('admin.filterStatus')}
                        </label>
                        <Select
                            value={filters.status ?? ALL}
                            onValueChange={(value) =>
                                updateFilters({
                                    status: value === ALL ? '' : value,
                                })
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL}>
                                    {t('admin.filterAll')}
                                </SelectItem>
                                {statuses.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-48 space-y-1.5">
                        <label className="text-xs text-muted-foreground">
                            {t('admin.filterDate')}
                        </label>
                        <Input
                            type="date"
                            value={filters.date ?? ''}
                            onChange={(e) =>
                                updateFilters({ date: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('admin.columnPatient')}</TableHead>
                                <TableHead>{t('admin.columnDoctor')}</TableHead>
                                <TableHead>{t('admin.columnService')}</TableHead>
                                <TableHead>{t('admin.columnDateTime')}</TableHead>
                                <TableHead>{t('admin.columnStatus')}</TableHead>
                                <TableHead className="text-end">
                                    {t('admin.columnActions')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.data.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>
                                        <div className="font-medium">
                                            {booking.user.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {booking.user.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {pick(
                                            booking.doctor.name,
                                            booking.doctor.name_ar,
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {pick(
                                            booking.service.name,
                                            booking.service.name_ar,
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            booking.starts_at,
                                        ).toLocaleString(
                                            locale === 'ar' ? 'ar-AE' : 'en-AE',
                                            {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            },
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge
                                            status={booking.status}
                                            label={booking.status_label}
                                            labelAr={booking.status_label_ar}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-1.5">
                                            {nextActions(booking.status).map(
                                                (action) => (
                                                    <Button
                                                        key={action}
                                                        size="sm"
                                                        variant={
                                                            action === 'cancelled'
                                                                ? 'outline'
                                                                : 'secondary'
                                                        }
                                                        onClick={() =>
                                                            setStatus(
                                                                booking,
                                                                action,
                                                            )
                                                        }
                                                    >
                                                        {actionLabels[action]}
                                                    </Button>
                                                ),
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {bookings.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={bookings.current_page <= 1}
                            onClick={() =>
                                router.get(admin.bookings.index().url, {
                                    ...filters,
                                    page: bookings.current_page - 1,
                                })
                            }
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            {bookings.current_page} / {bookings.last_page}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={bookings.current_page >= bookings.last_page}
                            onClick={() =>
                                router.get(admin.bookings.index().url, {
                                    ...filters,
                                    page: bookings.current_page + 1,
                                })
                            }
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                )}
            </section>
        </>
    );
}
