import { Link } from '@inertiajs/react';
import { BrandMark } from '@/components/nova/brand-mark';
import { useBranding } from '@/hooks/use-branding';
import { cn } from '@/lib/utils';
import { home } from '@/routes';

export function NovaLogo({ className }: { className?: string }) {
    const { name, tagline } = useBranding();

    return (
        <Link
            href={home()}
            className={cn(
                'flex items-center gap-2 font-semibold tracking-tight',
                className,
            )}
        >
            <BrandMark />
            <span className="text-lg leading-none">
                {name}
                {tagline && (
                    <>
                        {' '}
                        <span className="font-normal text-muted-foreground">
                            {tagline}
                        </span>
                    </>
                )}
            </span>
        </Link>
    );
}
