import { Stethoscope } from 'lucide-react';
import { useBranding } from '@/hooks/use-branding';
import { cn } from '@/lib/utils';

type Props = {
    className?: string;
};

/**
 * The square brand icon. Renders the configured BRAND_LOGO when one is set,
 * otherwise the built-in stethoscope mark so the UI is never left blank.
 *
 * A dark-mode asset is rendered as a second <img> toggled by CSS rather than by
 * reading the theme in JS — that keeps it correct during SSR, where the active
 * theme isn't known yet.
 */
export function BrandMark({ className }: Props) {
    const { name, logo, logoDark } = useBranding();

    if (!logo) {
        return (
            <span
                className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground',
                    className,
                )}
            >
                <Stethoscope className="size-4.5" />
            </span>
        );
    }

    const hasDarkVariant = Boolean(logoDark) && logoDark !== logo;

    return (
        <span
            className={cn(
                'flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg',
                className,
            )}
        >
            <img
                src={logo}
                alt={name}
                className={cn(
                    'size-full object-contain',
                    hasDarkVariant && 'dark:hidden',
                )}
            />
            {hasDarkVariant && (
                <img
                    src={logoDark ?? undefined}
                    alt={name}
                    className="hidden size-full object-contain dark:block"
                />
            )}
        </span>
    );
}
