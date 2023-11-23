'use client';

import { cloneElement, createContext } from "react";
import { FluidTheme, parseCSSVariables, parseColorPalettes } from "../../src/core/theme";
import global from "../../src/styles/global";
import useColorScheme, { ColorScheme } from "../../src/hooks/use-color-scheme";
import { STYLE_CONTEXT, createGlobalStyles } from "../core/style";
import useMediaQuery from "../hooks/use-media-query";

const fluid = STYLE_CONTEXT.THEME;

type FluidContext = FluidTheme & {
    colorScheme: string;
    appliedColorScheme: string;
    setColorScheme: (scheme: ColorScheme<typeof fluid>) => void;
}

export const FluidContext = createContext<FluidContext | null>(null);

export default function FluidProvider({ children, initialColorScheme }: { children: React.ReactElement; initialColorScheme?: ColorScheme<typeof fluid>; }) {

    const colorSchemes = Object.keys(fluid.palettes).concat('system'); // type infer not working when compiled
    const { colorScheme, setColorScheme } = useColorScheme<typeof fluid>(initialColorScheme as ColorScheme<typeof fluid>, colorSchemes);
    const preferred = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    const systemColorScheme = preferred in fluid.palettes ? preferred : fluid.defaultColorScheme;

    createGlobalStyles(() => {
        const __fluid = STYLE_CONTEXT.THEME;

        return {
            ...parseColorPalettes(__fluid),
            ':root': parseCSSVariables(__fluid)
        };
    });
    createGlobalStyles(global);

    return <FluidContext.Provider value={{
        ...fluid,
        colorScheme,
        appliedColorScheme: colorScheme === 'system' ? systemColorScheme : colorScheme,
        setColorScheme
    }}>
        {cloneElement(children, {
            id: '__fluid',
            className: `scheme-${colorScheme}`
        })}
    </FluidContext.Provider>
}