import FluidStyleStore from "@/src/core/stylestore";
import useGlobalStyles from "@/src/hooks/use-global-styles";
import { cloneElement, createContext, useInsertionEffect, useMemo } from "react";
import { DEFAULT_THEME, FluidTheme, parseCSSVariables, parseColorPalettes } from "@/src/core/theme";
import global from "@/src/styles/global";
import { mergeRecursive } from "@/src/core/utils";
import useColorScheme from "@/src/hooks/use-color-scheme";

export const FluidContext = createContext({});

export default function FluidProvider({ children, theme = {} }: { children: React.ReactElement<HTMLBodyElement>, theme?: Partial<FluidTheme> }) {
    const [colorScheme, setColorScheme] = useColorScheme();

    const root = useMemo(() => {
        const fluid: FluidTheme = mergeRecursive(theme, DEFAULT_THEME);
        const variables = parseCSSVariables(fluid);
        const colorPalettes = parseColorPalettes(fluid);

        return { ':root': variables, ...colorPalettes };
    }, [theme]);

    useGlobalStyles(root);
    useGlobalStyles(global);

    // useInsertionEffect(() => {
    //     const tag = document.createElement('style');
    //     (document.head || document.getElementsByName('head')[0]).appendChild(tag);

    //     tag.innerText = FluidStyleStore.serialize();
    // }, []);

    return <FluidContext.Provider value={{}}>
        {cloneElement(children, {
            className: `scheme-${colorScheme}`
        })}
    </FluidContext.Provider>
}