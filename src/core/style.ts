import { FluidComponents, FluidStyles, Selectors } from "../types";
import { GLOBAL_CONTEXT } from "./shared";
import { FluidTheme } from "./theme";
import { mergeRecursive } from "./utils";

function hash(str: string) {
    let l = 0xdeadbeef, r = 0x41c6ce57;
    for (let i = 0, char; i < str.length; i++) {
        char = str.charCodeAt(i);

        l = Math.imul(l ^ char, 2654435761);
        r = Math.imul(r ^ char, 1597334677);
    }

    l = Math.imul(l ^ (l >>> 16), 2246822507) ^ Math.imul(r ^ (r >>> 13), 3266489909);
    r = Math.imul(r ^ (r >>> 16), 2246822507) ^ Math.imul(l ^ (l >>> 13), 3266489909);

    l = 4294967296 * (2097151 & r) + (l >>> 0);
    return l.toString(16).slice(-8).padStart(8, '0');
}

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
    const hashKey = hash(GLOBAL_CONTEXT.cssOutput === 'automatic' ? JSON.stringify([override, ruleset]) : key);

    GLOBAL_CONTEXT.styles[key] = rulesToString(mergeStyles(override, ruleset), hashKey);

    return GLOBAL_CONTEXT.styles[key].selectors;
}

export function createGlobalStyles(styles: ((fluid: FluidTheme) => FluidStyles) | FluidStyles) {
    const ruleset = styles instanceof Function ? styles(GLOBAL_CONTEXT.theme) : styles;
    const key = hash(JSON.stringify(ruleset));
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