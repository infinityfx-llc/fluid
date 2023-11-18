'use client';

import { useState, useEffect } from 'react';

export default function usePreferredColorScheme() {
    const [scheme, setScheme] = useState('light');

    const update = (e: MediaQueryListEvent | MediaQueryList) => setScheme(e.matches ? 'dark' : 'light');

    useEffect(() => {
        const query = window.matchMedia('(prefers-color-scheme: dark)');

        update(query);
        query.addEventListener('change', update);

        return () => query.removeEventListener('change', update);
    }, []);

    return scheme;
}