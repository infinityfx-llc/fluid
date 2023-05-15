import useGlobalStyles from "@/src/hooks/use-global-styles";
import { cloneElement, createContext, useInsertionEffect, useMemo } from "react";
import { DEFAULT_THEME, FluidTheme, PartialFluidTheme, parseCSSVariables, parseColorPalettes } from "@/src/core/theme";
import global from "@/src/styles/global";
import { classes, mergeRecursive } from "@/src/core/utils";
import useColorScheme, { ColorScheme } from "@/src/hooks/use-color-scheme";
import FluidStyleStore from "../core/stylestore";

type FluidContext = FluidTheme & {
    colorScheme: string;
    setColorScheme: (scheme: ColorScheme<any>) => void;
}

export const FluidContext = createContext<FluidContext | null>(null);

export default function FluidProvider({ children, theme = {}, initialColorScheme }: { children: React.ReactElement<HTMLBodyElement>, theme?: PartialFluidTheme; initialColorScheme?: ColorScheme<any>; }) {
    const [styles, fluid, colorSchemes] = useMemo(() => {
        const fluid = mergeRecursive(theme, DEFAULT_THEME);
        const variables = parseCSSVariables(fluid);
        const colorPalettes = parseColorPalettes(fluid);

        return [{ ':root': variables, ...colorPalettes }, fluid, Object.keys(fluid.palettes)];
    }, [theme]);

    const { automatic, colorScheme, setColorScheme } = useColorScheme<typeof fluid>((initialColorScheme || fluid.defaultColorScheme) as ColorScheme<typeof fluid>, colorSchemes);

    useGlobalStyles(styles);
    useGlobalStyles(global);

    useInsertionEffect(() => FluidStyleStore.update(true), []);

    return <FluidContext.Provider value={{ ...fluid, colorScheme, setColorScheme }}>
        {cloneElement(children, {
            className: classes(`scheme-${colorScheme}`, automatic ? 'automatic' : undefined)
        })}
    </FluidContext.Provider>
}