import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLang } from '@/hooks/use-lang';
import type { Slot } from '@/types/clinic';

export function SlotPicker({
    date,
    minDate,
    slots,
    onDateChange,
    onSelectSlot,
}: {
    date: string;
    minDate: string;
    slots: Slot[];
    onDateChange: (date: string) => void;
    onSelectSlot: (slot: Slot) => void;
}) {
    const { t } = useLang();

    return (
        <div className="space-y-6">
            <div className="max-w-xs space-y-1.5">
                <Label htmlFor="booking-date" className="flex items-center gap-1.5">
                    <CalendarDays className="size-4" />
                    {t('booking.pickDate')}
                </Label>
                <Input
                    id="booking-date"
                    type="date"
                    min={minDate}
                    value={date}
                    onChange={(e) => onDateChange(e.target.value)}
                />
            </div>

            {slots.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    {t('booking.noSlots')}
                </p>
            ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                    {slots.map((slot) => (
                        <Button
                            key={slot.starts_at}
                            variant="outline"
                            onClick={() => onSelectSlot(slot)}
                        >
                            {slot.label}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
