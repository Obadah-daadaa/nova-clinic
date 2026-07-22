import { Check } from 'lucide-react';
import { useLang } from '@/hooks/use-lang';
import { cn } from '@/lib/utils';

export function BookingStepper({ current }: { current: 1 | 2 | 3 | 4 }) {
    const { t } = useLang();

    const steps = [
        { n: 1, label: t('booking.stepService') },
        { n: 2, label: t('booking.stepDoctor') },
        { n: 3, label: t('booking.stepSlot') },
        { n: 4, label: t('booking.stepConfirm') },
    ] as const;

    return (
        <ol className="mx-auto flex max-w-2xl items-center justify-between gap-2">
            {steps.map((step, i) => {
                const state =
                    step.n < current
                        ? 'done'
                        : step.n === current
                          ? 'current'
                          : 'upcoming';

                return (
                    <li
                        key={step.n}
                        className="flex flex-1 items-center gap-2"
                    >
                        <div className="flex flex-col items-center gap-1.5">
                            <span
                                className={cn(
                                    'flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium',
                                    state === 'done' &&
                                        'border-primary bg-primary text-primary-foreground',
                                    state === 'current' &&
                                        'border-primary text-primary',
                                    state === 'upcoming' &&
                                        'border-border text-muted-foreground',
                                )}
                            >
                                {state === 'done' ? (
                                    <Check className="size-4" />
                                ) : (
                                    step.n
                                )}
                            </span>
                            <span
                                className={cn(
                                    'text-xs font-medium whitespace-nowrap',
                                    state === 'upcoming'
                                        ? 'text-muted-foreground'
                                        : 'text-foreground',
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <span
                                className={cn(
                                    '-mt-5 h-px flex-1',
                                    step.n < current
                                        ? 'bg-primary'
                                        : 'bg-border',
                                )}
                            />
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
