'use client';

import { useLayoutEffect, useState } from "react";
import { cookies, formatCookie } from "../core/utils";
import { COLOR_SCHEME_COOKIE } from "../core/theme";
import type { FluidColorScheme } from "../types";

export default function useColorScheme(initial: FluidColorScheme = 'system', schemes = ['light', 'dark', 'system']) {
    const [colorScheme, setColorScheme] = useState(initial);

    function updateColorScheme(scheme: FluidColorScheme) {
        if (!schemes.includes(scheme)) return;

        document.cookie = formatCookie(COLOR_SCHEME_COOKIE, scheme, {
            maxAge: 604800
        });

        setColorScheme(scheme);

        const element = document.getElementById('__fluid__global');
        if (element) {
            let current: string | undefined;

            element.classList.forEach(key => {
                if (key.startsWith('scheme-')) current = key;
            });

            current ?
                element.classList.replace(current, 'scheme-' + scheme) :
                element.classList.add('scheme-' + scheme);
        }

        const meta = document.getElementById('fluid-color-scheme-meta') as HTMLMetaElement | null;
        if (meta && ['light', 'dark'].includes(scheme)) {
            meta.content = scheme === 'light' ? 'only ' + scheme : scheme;
        }
    }

    useLayoutEffect(() => {
        const scheme = cookies()[COLOR_SCHEME_COOKIE];
        updateColorScheme(scheme as FluidColorScheme);
    }, []);

    return {
        colorScheme,
        setColorScheme: updateColorScheme
    };
}