import { Link } from '@inertiajs/react';
import { Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { home } from '@/routes';

export function NovaLogo({ className }: { className?: string }) {
    return (
        <Link
            href={home()}
            className={cn(
                'flex items-center gap-2 font-semibold tracking-tight',
                className,
            )}
        >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Stethoscope className="size-4.5" />
            </span>
            <span className="text-lg leading-none">
                Nova{' '}
                <span className="font-normal text-muted-foreground">
                    Clinic
                </span>
            </span>
        </Link>
    );
}
