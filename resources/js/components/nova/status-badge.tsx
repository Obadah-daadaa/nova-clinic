import { Badge } from '@/components/ui/badge';
import { useLang } from '@/hooks/use-lang';
import { cn } from '@/lib/utils';
import type { BookingStatusValue } from '@/types/clinic';

const styles: Record<BookingStatusValue, string> = {
    pending:
        'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400',
    confirmed:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400',
    completed: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-400',
    cancelled:
        'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-400',
    no_show: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-400',
};

export function StatusBadge({
    status,
    label,
    labelAr,
}: {
    status: BookingStatusValue;
    label: string;
    labelAr: string;
}) {
    const { pick } = useLang();

    return (
        <Badge
            variant="outline"
            className={cn('border-transparent', styles[status])}
        >
            {pick(label, labelAr)}
        </Badge>
    );
}
