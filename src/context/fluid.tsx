import useGlobalStyles from "@/src/hooks/use-global-styles";
import { cloneElement, createContext, useMemo } from "react";
import { DEFAULT_THEME, FluidTheme, parseCSSVariables, parseColorPalettes } from "@/src/core/theme";
import global from "@/src/styles/global";
import { mergeRecursive } from "@/src/core/utils";
import useColorScheme from "@/src/hooks/use-color-scheme";

export const FluidContext = createContext({});

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

    return <FluidContext.Provider value={fluid}>
        {cloneElement(children, {
            className: `scheme-${colorScheme} testing`
        })}
    </FluidContext.Provider>
}