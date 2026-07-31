import { Languages } from 'lucide-react';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useLang } from '@/hooks/use-lang';

/**
 * Language switch styled as a sidebar row, so it collapses to an icon with a
 * tooltip like the rest of the sidebar nav. The label always names the language
 * you're switching *to*, which is why it reads "العربية" while in English.
 */
export function SidebarLangToggle() {
    const { locale, toggle } = useLang();
    const target = locale === 'en' ? 'العربية' : 'English';

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={toggle}
                    tooltip={{ children: target }}
                    aria-label={`Switch language to ${locale === 'en' ? 'Arabic' : 'English'}`}
                >
                    <Languages />
                    <span>{target}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
