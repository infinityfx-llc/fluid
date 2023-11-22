import type { FluidInputvalue, FluidStyles, Merged, Selectors } from "../types";

export const round = (val: number, n = 2) => Math.round(val * Math.pow(10, n)) / Math.pow(10, n);

export const toNumber = (val: any, fallback: number): number => {
    val = typeof val === 'string' ? parseFloat(val) : val;
    return val === undefined || isNaN(val) ? fallback : val;
}

export function changeInputValue(input: HTMLInputElement, value: FluidInputvalue) {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
}

export function mergeRecursive<T = any, P = any>(a: T, b: P) {
    if (a === undefined) return b as Merged<T, P>;
    if (typeof a !== 'object' || Array.isArray(a)) return a as Merged<T, P>;

    const merged: any = Object.assign({}, a);
    for (const key in b) {
        merged[key] = mergeRecursive(merged[key], b[key]);
    }

    return merged as Merged<T, P>;
}

export function classes(...args: any[]) {
    return args.filter(val => typeof val === 'string').join(' ');
}

export function combineClasses(initial: Selectors, override: Selectors) {
    const combined = Object.assign({}, initial);

    for (const key in override) {
        key in initial ? combined[key] += ` ${override[key]}` : combined[key] = override[key];
    }

    return combined;
}

export function combineRefs(...refs: (React.Ref<any> | undefined)[]) {
    return (el: any) => {
        refs.forEach(ref => {
            if (ref && 'current' in ref) (ref as React.MutableRefObject<any>).current = el;
            if (ref instanceof Function) ref(el);
        });
    };
}

export function hashStyles(...styles: FluidStyles[]) {
    const str = JSON.stringify(styles);

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

export function mergeStyles(...styles: FluidStyles[]) {
    const merged: FluidStyles = {};

    for (const ruleset of styles) {
        for (const selector in ruleset) {
            const value = mergeRecursive(merged[selector], ruleset[selector]);
            if (value !== undefined) merged[selector] = value;
        }
    }

    return merged;
}

export function rulesToString__EXP(ruleset: React.CSSProperties | { [key: string]: React.CSSProperties } | FluidStyles, postfix?: string, selectors: Selectors = {}): { rules: string; selectors: Selectors; } {
    const rules = Object.entries(ruleset).reduce((str, [attr, value]) => {
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

            return str + `${prefixed}{${rulesToString__EXP(value, postfix, selectors).rules}}`;
        }
        if (value === undefined) return str;

        return str + `${attr.replace(/(.?)([A-Z])/g, '$1-$2').toLowerCase()}:${value};`;
    }, '');

    return { rules, selectors };
}

export function cookies() {
    return document.cookie.split(';').reduce<{ [key: string]: string }>((cookies, cookie) => {
        const [key, value] = cookie.split('=');

        if (key && value) cookies[decodeURIComponent(key.trim())] = decodeURIComponent(value.trim());

        return cookies;
    }, {});
}

type CookieOptions = {
    domain?: string;
    path?: string;
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None'
}

export function formatCookie(key: string, value: string, options: CookieOptions = {}) {
    options = Object.assign({ path: '/', secure: true, sameSite: 'Lax' }, options);

    const config = Object.entries(options).map(([key, val]) => {
        if (key === 'maxAge') key = 'max-Age';
        key = key.charAt(0).toUpperCase() + key.slice(1);

        if (typeof val === 'boolean') {
            return val ? `${key};` : '';
        }

        return typeof val === 'undefined' ? '' : `${key}=${val};`;
    }).join(' ');

    return `${key}=${value}; ${config}`;
}

export function getFocusable<T extends boolean = true>(element: HTMLElement | null, list: T = true as T): T extends true | undefined ? NodeListOf<HTMLElement> : HTMLElement | null {
    if (!element) return list ? [] : null as any;

    const selector = 'a:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"])';

    return list ?
        element.querySelectorAll(selector) :
        element.querySelector(selector) as any;
}