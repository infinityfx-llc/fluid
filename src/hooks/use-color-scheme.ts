import { useState } from "react";
import { cookies, formatCookie } from "../core/utils";
import { COLOR_SCHEME_COOKIE, FluidTheme } from "../core/theme";
import useDomEffect from "./use-dom-effect";

export type ColorScheme<T extends FluidTheme> = (keyof T['palettes'] extends string ? keyof T['palettes'] : never) | 'light' | 'dark';

export default function useColorScheme<T extends FluidTheme>(initial: ColorScheme<T> = 'light', schemes = ['light', 'dark']) {
    const [colorScheme, setColorScheme] = useState(initial);
    const [automatic, setAutomatic] = useState(true);

    function updateColorScheme(scheme: ColorScheme<T>) {
        if (!schemes.includes(scheme)) return;
        document.cookie = formatCookie(COLOR_SCHEME_COOKIE, scheme, {
            maxAge: 604800
        });

        setColorScheme(scheme);
        setAutomatic(false);
    }

    useDomEffect(() => {
        const scheme = cookies()[COLOR_SCHEME_COOKIE];
        updateColorScheme(scheme as ColorScheme<T>);
    }, []);

    return {
        automatic,
        colorScheme,
        setColorScheme: updateColorScheme
    };
}