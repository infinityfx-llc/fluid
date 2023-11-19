'use client';

import { useState, useEffect } from 'react';

export default function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);

    const update = (e: MediaQueryListEvent | MediaQueryList) => setMatches(e.matches);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);

        update(mediaQuery);
        mediaQuery.addEventListener('change', update);

        return () => mediaQuery.removeEventListener('change', update);
    }, []);

    return matches;
}