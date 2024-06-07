'use client';

import { useState } from "react";
import { cookies, formatCookie } from "../core/utils";
import { COLOR_SCHEME_COOKIE } from "../core/theme";
import useDomEffect from "./use-dom-effect";
import type { FluidColorScheme } from "../types";

export default function useColorScheme(initial: FluidColorScheme = 'system', schemes = ['light', 'dark', 'system']) {
    const [colorScheme, setColorScheme] = useState(initial);

    function updateColorScheme(scheme: FluidColorScheme) {
        if (!schemes.includes(scheme)) return;
        
        document.cookie = formatCookie(COLOR_SCHEME_COOKIE, scheme, {
            maxAge: 604800
        });

        setColorScheme(scheme);
    }

    useDomEffect(() => {
        const scheme = cookies()[COLOR_SCHEME_COOKIE];
        updateColorScheme(scheme as FluidColorScheme);
    }, []);

    return {
        colorScheme,
        setColorScheme: updateColorScheme
    };
}