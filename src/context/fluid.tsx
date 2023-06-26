'use client';

import useGlobalStyles from "@/src/hooks/use-global-styles";
import { cloneElement, createContext, useInsertionEffect, useMemo } from "react";
import { DEFAULT_THEME, FluidTheme, PartialFluidTheme, parseCSSVariables, parseColorPalettes } from "@/src/core/theme";
import global from "@/src/styles/global";
import { classes, mergeRecursive } from "@/src/core/utils";
import useColorScheme, { ColorScheme } from "@/src/hooks/use-color-scheme";
import FluidStyleStore from "../core/stylestore";
import { FluidStyles } from "../types";

type FluidContext = FluidTheme & {
    colorScheme: string;
    setColorScheme: (scheme: ColorScheme<any>) => void;
}

export const FluidContext = createContext<FluidContext | null>(null);

export default function FluidProvider({ children, theme = {}, initialColorScheme }: { children: React.ReactElement; theme?: PartialFluidTheme; initialColorScheme?: ColorScheme<any>; }) {
    const [styles, fluid, colorSchemes] = useMemo(() => {
        const fluid = mergeRecursive(theme, DEFAULT_THEME);
        const variables = parseCSSVariables(fluid);
        const colorPalettes = parseColorPalettes(fluid);

        const styles = {
            ...colorPalettes,
            ':root': {
                ...variables,
                '--f-page-lrg': '12rem',
                '--f-page-med': '18rem',
                '--f-page-sml': '24rem',
            },
            [`@media(max-width: ${fluid.breakpoints.dsk}px)`]: {
                ':root': {
                    '--f-page-lrg': '8rem',
                    '--f-page-med': '12rem',
                    '--f-page-sml': '18rem',
                }
            },
            [`@media(max-width: ${fluid.breakpoints.lap}px)`]: {
                ':root': {
                    '--f-page-lrg': '4rem',
                    '--f-page-med': '8rem',
                    '--f-page-sml': '12rem',
                }
            },
            [`@media(max-width: ${fluid.breakpoints.tab}px)`]: {
                ':root': {
                    '--f-page-lrg': '2rem',
                    '--f-page-med': '4rem',
                    '--f-page-sml': '6rem',
                }
            },
            [`@media(max-width: ${fluid.breakpoints.mob}px)`]: {
                ':root': {
                    '--f-page-lrg': '1rem',
                    '--f-page-med': '2rem',
                    '--f-page-sml': '4rem',
                }
            }
        } as FluidStyles;

        return [styles, fluid, Object.keys(fluid.palettes)];
    }, [theme]);

    const { automatic, colorScheme, setColorScheme } = useColorScheme<typeof fluid>((initialColorScheme || fluid.defaultColorScheme) as ColorScheme<typeof fluid>, colorSchemes);

    useGlobalStyles(styles);
    useGlobalStyles(global);

    useInsertionEffect(() => FluidStyleStore.update(true), []);

    return <FluidContext.Provider value={{ ...fluid, colorScheme, setColorScheme }}>
        {cloneElement(children, {
            id: '__fluid',
            className: classes(`scheme-${colorScheme}`, automatic ? 'automatic' : undefined)
        })}
    </FluidContext.Provider>
}