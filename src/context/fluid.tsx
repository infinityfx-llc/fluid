import useGlobalStyles from "@/src/hooks/use-global-styles";
import { cloneElement, createContext, useInsertionEffect, useMemo } from "react";
import { DEFAULT_THEME, FluidTheme, parseCSSVariables, parseColorPalettes } from "@/src/core/theme";
import global from "@/src/styles/global";
import { mergeRecursive } from "@/src/core/utils";
import useColorScheme from "@/src/hooks/use-color-scheme";
import FluidStyleStore from "../core/stylestore";

type FluidContext = FluidTheme & {
    colorScheme: string;
    setColorScheme: (scheme: string) => void;
}

export const FluidContext = createContext<FluidContext | null>(null);

export default function FluidProvider({ children, theme = {} }: { children: React.ReactElement<HTMLBodyElement>, theme?: Partial<FluidTheme> }) {
    const [styles, fluid] = useMemo(() => {
        const fluid: FluidTheme = mergeRecursive(theme, DEFAULT_THEME);
        const variables = parseCSSVariables(fluid);
        const colorPalettes = parseColorPalettes(fluid);

        return [{ ':root': variables, ...colorPalettes }, fluid];
    }, [theme]);

    const [colorScheme, setColorScheme] = useColorScheme(fluid.defaultColorScheme);

    useGlobalStyles(styles);
    useGlobalStyles(global);

    useInsertionEffect(() => FluidStyleStore.update(true), []);

    return <FluidContext.Provider value={{ ...fluid, colorScheme, setColorScheme }}>
        {cloneElement(children, {
            className: `scheme-${colorScheme} testing`
        })}
    </FluidContext.Provider>
}