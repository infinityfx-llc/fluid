'use client';

import { useState } from "react";
import { cookies, formatCookie } from "../core/utils";
import { COLOR_SCHEME_COOKIE, FluidTheme } from "../core/theme";
import useDomEffect from "./use-dom-effect";

export type ColorScheme<T extends FluidTheme> = (keyof T['palettes'] extends string ? keyof T['palettes'] : never) | 'light' | 'dark' | 'system';

export default function useColorScheme<T extends FluidTheme>(initial: ColorScheme<T> = 'system', schemes = ['light', 'dark', 'system']) {
    const [colorScheme, setColorScheme] = useState(initial);

    function updateColorScheme(scheme: ColorScheme<T>) {
        if (!schemes.includes(scheme)) return;
        document.cookie = formatCookie(COLOR_SCHEME_COOKIE, scheme, {
            maxAge: 604800
        });

        setColorScheme(scheme);
    }

    useDomEffect(() => {
        const scheme = cookies()[COLOR_SCHEME_COOKIE];
        updateColorScheme(scheme as ColorScheme<T>);
    }, []);

    return {
        colorScheme,
        setColorScheme: updateColorScheme
    };
}