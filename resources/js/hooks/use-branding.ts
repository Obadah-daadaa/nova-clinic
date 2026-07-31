import { usePage } from '@inertiajs/react';
import type { Branding } from '@/types';

const FALLBACK: Branding = {
    name: 'Nova Clinic',
    tagline: null,
    logo: null,
    logoDark: null,
};

/**
 * Brand name/tagline/logo as configured through env on the server. Falls back
 * to sensible defaults so components never have to null-check.
 */
export function useBranding(): Branding {
    const { branding } = usePage<{ branding?: Branding }>().props;

    return branding ?? FALLBACK;
}
