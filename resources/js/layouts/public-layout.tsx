import type { PropsWithChildren } from 'react';
import { Footer } from '@/components/nova/footer';
import { Navbar } from '@/components/nova/navbar';
import { useFlashMessages } from '@/hooks/use-flash-messages';
import { LangProvider } from '@/hooks/use-lang';

function PublicLayoutInner({ children }: PropsWithChildren) {
    useFlashMessages();

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}

export default function PublicLayout({ children }: PropsWithChildren) {
    return (
        <LangProvider>
            <PublicLayoutInner>{children}</PublicLayoutInner>
        </LangProvider>
    );
}
