import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useLang } from '@/hooks/use-lang';
import { cn } from '@/lib/utils';

type Props = {
    value: string | null;
    onChange: (value: string | null) => void;
    placeholder?: string;
    className?: string;
};

function toDateOnly(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);

    return new Date(year, month - 1, day);
}

function toValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export function DatePicker({ value, onChange, placeholder, className }: Props) {
    const { locale } = useLang();
    const selected = value ? toDateOnly(value) : null;
    const [cursor, setCursor] = useState(() => selected ?? new Date());
    const [open, setOpen] = useState(false);

    const monthLabel = cursor.toLocaleDateString(
        locale === 'ar' ? 'ar-AE' : 'en-AE',
        { month: 'long', year: 'numeric' },
    );

    const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(gridStart.getDate() - startOffset);

    const weekdayLabels = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(2024, 0, 7 + i);

        return d.toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-AE', {
            weekday: 'short',
        });
    });

    const cells = Array.from({ length: 42 }, (_, i) => {
        const d = new Date(gridStart);
        d.setDate(d.getDate() + i);

        return d;
    });

    const today = new Date();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'w-full justify-start gap-2 text-start font-normal',
                        !value && 'text-muted-foreground',
                        className,
                    )}
                >
                    <CalendarIcon className="size-4" />
                    {value
                        ? toDateOnly(value).toLocaleDateString(
                              locale === 'ar' ? 'ar-AE' : 'en-AE',
                              { day: 'numeric', month: 'short', year: 'numeric' },
                          )
                        : (placeholder ?? '')}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() =>
                            setCursor(
                                new Date(
                                    cursor.getFullYear(),
                                    cursor.getMonth() - 1,
                                    1,
                                ),
                            )
                        }
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm font-medium capitalize">
                        {monthLabel}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() =>
                            setCursor(
                                new Date(
                                    cursor.getFullYear(),
                                    cursor.getMonth() + 1,
                                    1,
                                ),
                            )
                        }
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                    {weekdayLabels.map((label, i) => (
                        <span key={i} className="py-1">
                            {label}
                        </span>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {cells.map((cell) => {
                        const inMonth = cell.getMonth() === cursor.getMonth();
                        const isSelected = selected && isSameDay(cell, selected);
                        const isToday = isSameDay(cell, today);

                        return (
                            <button
                                key={cell.toISOString()}
                                type="button"
                                onClick={() => {
                                    onChange(toValue(cell));
                                    setOpen(false);
                                }}
                                className={cn(
                                    'flex size-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-accent',
                                    !inMonth && 'text-muted-foreground/50',
                                    isSelected &&
                                        'bg-primary text-primary-foreground hover:bg-primary',
                                    !isSelected &&
                                        isToday &&
                                        'ring-1 ring-primary',
                                )}
                            >
                                {cell.getDate()}
                            </button>
                        );
                    })}
                </div>
                {value && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => {
                            onChange(null);
                            setOpen(false);
                        }}
                    >
                        {locale === 'ar' ? 'مسح' : 'Clear'}
                    </Button>
                )}
            </PopoverContent>
        </Popover>
    );
}
