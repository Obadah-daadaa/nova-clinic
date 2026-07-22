import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { BookingStepper } from '@/components/nova/booking-stepper';
import { SlotPicker } from '@/components/nova/slot-picker';
import { Button } from '@/components/ui/button';
import { useLang } from '@/hooks/use-lang';
import book from '@/routes/book';
import type { Doctor, Service, Slot } from '@/types/clinic';

type PageProps = {
    service: Service;
    doctor: Doctor;
    date: string;
    slots: Slot[];
};

const today = () => new Date().toISOString().slice(0, 10);

export default function BookSlot({ service, doctor, date, slots }: PageProps) {
    const { t, pick } = useLang();

    const handleDateChange = (newDate: string) => {
        router.get(
            book.slot({
                query: { service: service.id, doctor: doctor.id, date: newDate },
            }).url,
            {},
            { preserveState: true, preserveScroll: true, only: ['slots', 'date'] },
        );
    };

    const handleSelectSlot = (slot: Slot) => {
        router.get(
            book.confirm({
                query: {
                    service: service.id,
                    doctor: doctor.id,
                    starts_at: slot.starts_at,
                },
            }).url,
        );
    };

    return (
        <>
            <Head title="Choose a time" />

            <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
                <BookingStepper current={3} />

                <div className="mx-auto mt-10 mb-8 max-w-2xl text-center">
                    <h1 className="text-2xl font-semibold sm:text-3xl">
                        {t('booking.chooseSlot')}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {t('booking.chooseSlotSubtitle')}
                    </p>
                    <p className="mt-1 text-sm font-medium text-primary">
                        {pick(service.name, service.name_ar)} —{' '}
                        {pick(doctor.name, doctor.name_ar)}
                    </p>
                </div>

                <SlotPicker
                    date={date}
                    minDate={today()}
                    slots={slots}
                    onDateChange={handleDateChange}
                    onSelectSlot={handleSelectSlot}
                />

                <div className="mt-8 text-center">
                    <Button asChild variant="ghost">
                        <Link
                            href={book.doctor({ query: { service: service.id } })}
                            className="gap-1.5"
                        >
                            <ArrowLeft className="size-4" />
                            {t('booking.backToDoctors')}
                        </Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
