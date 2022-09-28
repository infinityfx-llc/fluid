import { useEffect, useRef, useState } from 'react';
import { DEFAULT_COLOR_SCHEME } from '@core/globals';
import useCookies from './cookies';

export default function useColorScheme() {
    const [colorScheme, setColorScheme] = useState(DEFAULT_COLOR_SCHEME);
    const mediaQuery = useRef();
    const [cookies, setCookie] = useCookies();

    const update = () => {
        if ('FLUID_PREF_COLOR_SCHEME' in cookies) return setColorScheme(cookies.FLUID_PREF_COLOR_SCHEME);

        setColorScheme(mediaQuery.current.matches ? 'dark' : DEFAULT_COLOR_SCHEME);
    };

    const set = scheme => setCookie('FLUID_PREF_COLOR_SCHEME', scheme);

    useEffect(() => {
        mediaQuery.current = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.current.addListener(update);

        return () => mediaQuery.current?.removeListener(update);
    }, []);

    useEffect(update, [cookies]);

    return [colorScheme, set];
}