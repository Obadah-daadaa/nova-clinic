import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';

export function ThemeToggle() {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() =>
                updateAppearance(
                    resolvedAppearance === 'dark' ? 'light' : 'dark',
                )
            }
        >
            {/*
                Both icons are rendered and picked by CSS instead of branching on
                the resolved theme. The server can't know the visitor's theme, so
                branching here made the server send one icon and the client
                hydrate with the other, which React reports as a hydration
                mismatch. The `dark` class is already on <html> before hydration,
                so CSS shows the right one with no flash.
            */}
            <Sun className="hidden size-4 dark:block" />
            <Moon className="size-4 dark:hidden" />
        </Button>
    );
}
