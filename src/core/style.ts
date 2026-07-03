import { FluidComponents, FluidStyles, Selectors } from "../types";
import { GLOBAL_CONTEXT } from "./shared";
import { FluidTheme } from "./theme";
import { hexHash, mergeRecursive } from "./utils";

function mergeStyles(...styles: FluidStyles[]) {
    const merged: FluidStyles = {};

    for (const ruleset of styles) {
        for (const selector in ruleset) {
            const value = mergeRecursive(merged[selector], ruleset[selector]);
            if (value !== undefined) merged[selector] = value;
        }
    }

    return merged;
}

function rulesToString(ruleset: React.CSSProperties | { [key: string]: React.CSSProperties } | FluidStyles, postfix?: string, selectors: Selectors = {}): { rules: string; selectors: Selectors; } {
    const rules = Object.entries(ruleset).reduce((str, [attr, value]) => {
        if (value === undefined || value === null) return str;

        if (typeof value === 'object') {
            const prefixed = (postfix ?
                attr.split(/((?::global\()?[.#][\w\-_][\w\d\-_]*)/gi)
                    .reduce((prefixed, seg) => {
                        if (/^[.#]/.test(seg)) {
                            const name = seg.slice(1);
                            selectors[name] = `${name}__${postfix}`;
                            seg = `${seg}__${postfix}`;
                        }

                        return prefixed + seg;
                    }, '') :
                attr)
                .replace(/:global\((.+?)\)/g, '$1');

            return str + `${prefixed}{${rulesToString(value, postfix, selectors).rules}}`;
        }

        return str + `${attr.replace(/(.?)([A-Z])/g, '$1-$2').toLowerCase()}:${value};`;
    }, '');

    return { rules, selectors };
}

export function createStyles(key: (string & {}) | keyof FluidComponents, styles: ((fluid: FluidTheme) => FluidStyles) | FluidStyles): Selectors {
    const ruleset = styles instanceof Function ? styles(GLOBAL_CONTEXT.theme) : styles;

    const override = GLOBAL_CONTEXT.components[key] || {};
    const hashKey = hexHash(GLOBAL_CONTEXT.cssOutput === 'automatic' ? JSON.stringify([override, ruleset]) : key);

    GLOBAL_CONTEXT.styles[key] = rulesToString(mergeStyles(override, ruleset), hashKey);

    return GLOBAL_CONTEXT.styles[key].selectors;
}

export function createGlobalStyles(styles: ((fluid: FluidTheme) => FluidStyles) | FluidStyles) {
    const ruleset = styles instanceof Function ? styles(GLOBAL_CONTEXT.theme) : styles;
    const key = hexHash(JSON.stringify(ruleset));
    const { rules } = rulesToString(ruleset);

    if (!(key in GLOBAL_CONTEXT.styles)) {
        GLOBAL_CONTEXT.styles.__globals = {
            rules: (GLOBAL_CONTEXT.styles.__globals?.rules || '') + rules,
            selectors: {}
        };
        GLOBAL_CONTEXT.styles[key] = {
            rules: '',
            selectors: {}
        };
    }
}