'use client';

import { createContext, use } from "react";

type LocaleToken = 'copy' | 'clear' | 'close' | 'hide' | 'save' | 'show';

export type LocaleTokens = {
    [key in LocaleToken]: string;
};

const defaultLocaleTokens = {
    copy: 'Copy',
    clear: 'Clear',
    close: 'Close',
    hide: 'Hide',
    save: 'Save',
    show: 'Show'
};

export const LanguageContext = createContext<LocaleTokens>(defaultLocaleTokens);

export function useLang() {
    return use(LanguageContext);
}

export default function LanguageProvider({ children, tokens = {} }: {
    children: React.ReactNode;
    tokens?: Partial<LocaleTokens>;
}) {

    return <LanguageContext value={{ ...defaultLocaleTokens, ...tokens }}>
        {children}
    </LanguageContext>;
}