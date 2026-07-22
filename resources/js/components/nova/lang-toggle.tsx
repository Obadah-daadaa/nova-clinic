import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLang } from '@/hooks/use-lang';

export function LangToggle() {
    const { locale, toggle } = useLang();

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className="gap-1.5 px-2"
            aria-label="Toggle language"
        >
            <Languages className="size-4" />
            {locale === 'en' ? 'العربية' : 'English'}
        </Button>
    );
}
