import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
    
} from 'react';
import type {PropsWithChildren} from 'react';
import {  translate  } from '@/lib/i18n';
import type {Locale, TranslationKey} from '@/lib/i18n';

type LangContextValue = {
    locale: Locale;
    dir: 'ltr' | 'rtl';
    setLocale: (locale: Locale) => void;
    toggle: () => void;
    t: (key: TranslationKey) => string;
    pick: (en: string, ar: string) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = 'nova-clinic-locale';

function readInitialLocale(): Locale {
    if (typeof window === 'undefined') {
        return 'en';
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);

    return stored === 'ar' ? 'ar' : 'en';
}

export function LangProvider({ children }: PropsWithChildren) {
    const [locale, setLocaleState] = useState<Locale>(readInitialLocale);

    const setLocale = useCallback((next: Locale) => {
        setLocaleState(next);
        window.localStorage.setItem(STORAGE_KEY, next);
    }, []);

    const toggle = useCallback(() => {
        setLocale(locale === 'en' ? 'ar' : 'en');
    }, [locale, setLocale]);

    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', locale);
    }, [dir, locale]);

    const value = useMemo<LangContextValue>(
        () => ({
            locale,
            dir,
            setLocale,
            toggle,
            t: (key: TranslationKey) => translate(locale, key),
            pick: (en: string, ar: string) => (locale === 'ar' ? ar : en),
        }),
        [locale, dir, setLocale, toggle],
    );

    return (
        <LangContext.Provider value={value}>{children}</LangContext.Provider>
    );
}

export function useLang(): LangContextValue {
    const context = useContext(LangContext);

    if (!context) {
        throw new Error('useLang must be used within a LangProvider');
    }

    return context;
}
