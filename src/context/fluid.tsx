'use client';

import useGlobalStyles from "../../src/hooks/use-global-styles";
import { cloneElement, createContext, useInsertionEffect, useMemo } from "react";
import { DEFAULT_THEME, FluidTheme, PartialFluidTheme, parseCSSVariables, parseColorPalettes } from "../../src/core/theme";
import global from "../../src/styles/global";
import { mergeRecursive } from "../../src/core/utils";
import useColorScheme, { ColorScheme } from "../../src/hooks/use-color-scheme";
import FluidStyleStore from "../core/stylestore";
import type { FluidStyles, Merged } from "../types";

type FluidContext = FluidTheme & {
    colorScheme: string;
    setColorScheme: (scheme: ColorScheme<any>) => void;
}

export const FluidContext = createContext<FluidContext | null>(null);

export default function FluidProvider<T extends PartialFluidTheme>({ children, theme, initialColorScheme }: { children: React.ReactElement; theme?: T; initialColorScheme?: ColorScheme<Merged<T, typeof DEFAULT_THEME>>; }) {
    const [styles, fluid, colorSchemes] = useMemo(() => {
        const fluid = mergeRecursive(theme || {}, DEFAULT_THEME);
        const variables = parseCSSVariables(fluid);
        const colorPalettes = parseColorPalettes(fluid);

        const styles = {
            ...colorPalettes,
            ':root': variables
        } as FluidStyles;

        return [styles, fluid, Object.keys(fluid.palettes).concat('system')];
    }, [theme]);

    const { colorScheme, setColorScheme } = useColorScheme<typeof fluid>(initialColorScheme as ColorScheme<typeof fluid>, colorSchemes);

    useGlobalStyles(styles);
    useGlobalStyles(global);

    useInsertionEffect(() => FluidStyleStore.update(true), []);

    return <FluidContext.Provider value={{ ...fluid, colorScheme, setColorScheme }}>
        {cloneElement(children, {
            id: '__fluid',
            className: `scheme-${colorScheme}`
        })}
    </FluidContext.Provider>
}