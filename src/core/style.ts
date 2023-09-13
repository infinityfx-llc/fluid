import { FluidStyles, Selectors } from "../types";
import { DEFAULT_THEME, FluidTheme } from "./theme";
import { hashStyles, mergeStyles, rulesToString__EXP } from "./utils";

export const STYLE_CONTEXT: {
    STYLES: {
        [key: string]: {
            rules: string;
            selectors: Selectors;
        };
    };
    THEME: FluidTheme;
} = {
    STYLES: {},
    THEME: DEFAULT_THEME
};

export function createStyles(key: string, styles: ((fluid: FluidTheme) => FluidStyles) | FluidStyles): Selectors {
    const ruleset = styles instanceof Function ? styles(STYLE_CONTEXT.THEME) : styles;
    // merge with config file styles (from key)
    STYLE_CONTEXT.STYLES[key] = rulesToString__EXP(mergeStyles(ruleset, {}), hashStyles(ruleset, {}));

    return STYLE_CONTEXT.STYLES[key].selectors;
}

export function createGlobalStyles(styles: ((fluid: FluidTheme) => FluidStyles) | FluidStyles) {
    const ruleset = styles instanceof Function ? styles(STYLE_CONTEXT.THEME) : styles;
    const key = hashStyles(ruleset);
    const { rules } = rulesToString__EXP(ruleset);

    if (!(key in STYLE_CONTEXT.STYLES)) {
        const globals = STYLE_CONTEXT.STYLES.globals;
        STYLE_CONTEXT.STYLES.globals = { rules: (globals?.rules || '') + rules, selectors: {} };
        STYLE_CONTEXT.STYLES[key] = { rules: '', selectors: {} };
    }
}