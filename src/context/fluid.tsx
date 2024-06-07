'use client';

import { cloneElement, createContext } from "react";
import { FluidTheme, parseCSSVariables, parseColorPalettes } from "../../src/core/theme";
import global from "../../src/styles/global";
import useColorScheme from "../../src/hooks/use-color-scheme";
import { STYLE_CONTEXT, createGlobalStyles } from "../core/style";
import useMediaQuery from "../hooks/use-media-query";
import type { FluidColorScheme } from "../types";

const fluid = STYLE_CONTEXT.THEME;

type FluidContext = FluidTheme & {
    colorScheme: FluidColorScheme;
    appliedColorScheme: FluidColorScheme;
    setColorScheme: (scheme: FluidColorScheme) => void;
}

export const FluidContext = createContext<FluidContext | null>(null);

export default function FluidProvider({ children, initialColorScheme }: {
    children: React.ReactElement<any>;
    initialColorScheme?: FluidColorScheme;
}) {

    const colorSchemes = Object.keys(fluid.palettes).concat('system');
    const { colorScheme, setColorScheme } = useColorScheme(initialColorScheme, colorSchemes);
    const preferred = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    const systemColorScheme = preferred in fluid.palettes ? preferred : fluid.defaultColorScheme as FluidColorScheme;

    createGlobalStyles(() => {
        const __fluid = STYLE_CONTEXT.THEME;

        return {
            ...parseColorPalettes(__fluid),
            ':root': parseCSSVariables(__fluid)
        };
    });
    createGlobalStyles(global);

    return <FluidContext value={{
        ...fluid,
        colorScheme,
        appliedColorScheme: colorScheme === 'system' ? systemColorScheme : colorScheme,
        setColorScheme
    }}>
        {cloneElement(children, {
            id: '__fluid',
            className: `scheme-${colorScheme}`
        })}
    </FluidContext>
}