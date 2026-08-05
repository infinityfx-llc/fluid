'use client';

import { createContext } from "react";
import { FluidTheme, parseCSSVariables, parseColorPalettes, parseUtilityClasses } from "../../src/core/theme";
import global from "../../src/styles/global";
import useColorScheme from "../../src/hooks/use-color-scheme";
import { createGlobalStyles } from "../core/style";
import useMediaQuery from "../hooks/use-media-query";
import type { FluidColorScheme, PolymorphComponentProps } from "../types";
import { GLOBAL_CONTEXT } from "../core/shared";
import SingletonsProvider from "./singletons";
import LanguageProvider, { LocaleTokens } from "./lang";
import { classes } from "../utils";

const fluid = GLOBAL_CONTEXT.theme;

type FluidContext = FluidTheme & {
    colorScheme: FluidColorScheme;
    appliedColorScheme: FluidColorScheme;
    setColorScheme: (scheme: FluidColorScheme) => void;
}

export const FluidContext = createContext<FluidContext | null>(null);

/**
 * Provides theme data to other Fluid components.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/get-started}
 */
export default function FluidProvider<E extends React.ElementType = 'body'>({ children, initialColorScheme, localeTokens, as, ...props }: {
    initialColorScheme?: FluidColorScheme;
    localeTokens?: Partial<LocaleTokens>;
} & PolymorphComponentProps<E>) {
    const colorSchemes = Object.keys(fluid.palettes).concat('system');
    const { colorScheme, setColorScheme } = useColorScheme(initialColorScheme, colorSchemes);
    const preferred = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    const systemColorScheme = preferred in fluid.palettes ? preferred : fluid.defaultColorScheme;

    createGlobalStyles(() => {
        const { theme, includeUtilityClasses } = GLOBAL_CONTEXT;

        return {
            ...parseUtilityClasses(theme, includeUtilityClasses),
            ...parseColorPalettes(theme),
            ':root': parseCSSVariables(theme)
        };
    });
    createGlobalStyles(global);

    const Wrapper = as || 'body';

    return <FluidContext value={{
        ...fluid,
        colorScheme,
        appliedColorScheme: colorScheme === 'system' ? systemColorScheme : colorScheme,
        setColorScheme
    }}>
        <LanguageProvider tokens={localeTokens}>
            <SingletonsProvider>
                <Wrapper
                    {...props}
                    id="__fluid"
                    className={classes(
                        props.className,
                        `scheme-${colorScheme}`
                    )}>
                    {children}
                </Wrapper>
            </SingletonsProvider>
        </LanguageProvider>
    </FluidContext>
}