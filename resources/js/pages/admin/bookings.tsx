import { Head, router } from '@inertiajs/react';
import {
    CalendarX2,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Pencil,
    ThumbsDown,
    UserCheck,
} from 'lucide-react';
import { useState } from 'react';
import { DatePicker } from '@/components/nova/date-picker';
import { StatusBadge } from '@/components/nova/status-badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
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
import type { Booking, BookingStatusValue, Doctor, Service } from '@/types/clinic';

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
    doctors: Doctor[];
    services: Service[];
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

function toLocalDateValue(iso: string): string {
    const date = new Date(iso);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60_000);

    return local.toISOString().slice(0, 10);
}

function toLocalTimeValue(iso: string): string {
    const date = new Date(iso);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60_000);

    return local.toISOString().slice(11, 16);
}

export default function AdminBookings({
    bookings,
    filters,
    statuses,
    doctors,
    services,
}: PageProps) {
    const { t, pick, locale } = useLang();
    const [editing, setEditing] = useState<Booking | null>(null);
    const [editDoctorId, setEditDoctorId] = useState('');
    const [editServiceId, setEditServiceId] = useState('');
    const [editDate, setEditDate] = useState<string | null>(null);
    const [editTime, setEditTime] = useState('');
    const [editNotes, setEditNotes] = useState('');

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
        router.patch(admin.bookings.update(booking.id).url, {
            status,
        });
    };

    const openEdit = (booking: Booking) => {
        setEditing(booking);
        setEditDoctorId(String(booking.doctor.id));
        setEditServiceId(String(booking.service.id));
        setEditDate(toLocalDateValue(booking.starts_at));
        setEditTime(toLocalTimeValue(booking.starts_at));
        setEditNotes(booking.notes ?? '');
    };

    const submitEdit = () => {
        if (!editing || !editDate || !editTime) {
            return;
        }

        router.patch(
            admin.bookings.update(editing.id).url,
            {
                doctor_id: Number(editDoctorId),
                service_id: Number(editServiceId),
                starts_at: `${editDate}T${editTime}`,
                notes: editNotes,
            },
            {
                onSuccess: () => setEditing(null),
            },
        );
    };

    const actionLabels: Record<BookingStatusValue, string> = {
        pending: t('admin.actionConfirm'),
        confirmed: t('admin.actionComplete'),
        completed: t('admin.actionComplete'),
        cancelled: t('admin.actionCancel'),
        no_show: t('admin.actionNoShow'),
    };

    const actionIcons: Record<BookingStatusValue, typeof UserCheck> = {
        pending: UserCheck,
        confirmed: CheckCircle2,
        completed: CheckCircle2,
        cancelled: CalendarX2,
        no_show: ThumbsDown,
    };

    return (
        <>
            <Head title="Admin — Bookings" />

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
                    <DatePicker
                        value={filters.date}
                        onChange={(date) =>
                            updateFilters({ date: date ?? '' })
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
                                <TableCell className="text-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label={t(
                                                    'admin.openActions',
                                                )}
                                            >
                                                <MoreVertical className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    openEdit(booking)
                                                }
                                            >
                                                <Pencil className="size-4" />
                                                {t('admin.actionEdit')}
                                            </DropdownMenuItem>
                                            {nextActions(booking.status)
                                                .length > 0 && (
                                                <DropdownMenuSeparator />
                                            )}
                                            {nextActions(booking.status).map(
                                                (action) => {
                                                    const ActionIcon =
                                                        actionIcons[action];

                                                    return (
                                                        <DropdownMenuItem
                                                            key={action}
                                                            variant={
                                                                action ===
                                                                'cancelled'
                                                                    ? 'destructive'
                                                                    : 'default'
                                                            }
                                                            onClick={() =>
                                                                setStatus(
                                                                    booking,
                                                                    action,
                                                                )
                                                            }
                                                        >
                                                            <ActionIcon className="size-4" />
                                                            {
                                                                actionLabels[
                                                                    action
                                                                ]
                                                            }
                                                        </DropdownMenuItem>
                                                    );
                                                },
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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

            <Sheet
                open={editing !== null}
                onOpenChange={(open) => !open && setEditing(null)}
            >
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>
                            {t('admin.editBookingTitle')}
                        </SheetTitle>
                        <p className="text-sm text-muted-foreground">
                            {t('admin.editBookingSubtitle')}
                        </p>
                    </SheetHeader>

                    <div className="grid gap-4 px-4">
                        <div className="grid gap-2">
                            <Label>{t('admin.fieldDoctor')}</Label>
                            <Select
                                value={editDoctorId}
                                onValueChange={setEditDoctorId}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors.map((doctor) => (
                                        <SelectItem
                                            key={doctor.id}
                                            value={String(doctor.id)}
                                        >
                                            {pick(doctor.name, doctor.name_ar)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>{t('admin.fieldService')}</Label>
                            <Select
                                value={editServiceId}
                                onValueChange={setEditServiceId}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {services.map((service) => (
                                        <SelectItem
                                            key={service.id}
                                            value={String(service.id)}
                                        >
                                            {pick(
                                                service.name,
                                                service.name_ar,
                                            )}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>{t('admin.fieldDateTime')}</Label>
                            <div className="flex gap-2">
                                <DatePicker
                                    value={editDate}
                                    onChange={setEditDate}
                                    className="flex-1"
                                />
                                <Input
                                    type="time"
                                    value={editTime}
                                    onChange={(e) =>
                                        setEditTime(e.target.value)
                                    }
                                    className="w-32"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-notes">
                                {t('admin.fieldNotes')}
                            </Label>
                            <textarea
                                id="edit-notes"
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                rows={3}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                        </div>
                    </div>

                    <SheetFooter>
                        <Button onClick={submitEdit}>
                            {t('admin.saveChanges')}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setEditing(null)}
                        >
                            {t('admin.cancelEdit')}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}
