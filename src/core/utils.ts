import type { FluidInputvalue, Merged, Selectors } from "../types";

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
    if (typeof a !== 'object' || a === null || Array.isArray(a)) return a as Merged<T, P>;

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
            if (ref && 'current' in ref) (ref as React.RefObject<any>).current = el;
            if (ref instanceof Function) ref(el);
        });
    };
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

const selector = 'a[href], button, input, textarea, [tabindex]';

export function getFocusable<T extends boolean = true>(element: HTMLElement | null, list: T = true as T): T extends true | undefined ? HTMLElement[] : HTMLElement | null {
    if (!element) return list ? [] : null as any;

    const elements = filterFocusable(Array.from(element.querySelectorAll(selector)), false);

    return (list ? elements : elements[0] || null) as any;
}

export function filterFocusable(elements: Element[], types = true) {
    return elements
        .map(el => {
            if (types && !el.matches(selector)) {
                const child = el.querySelector(selector);

                if (!child) return null;

                el = child;
            }

            return el.hasAttribute('disabled') || el.getAttribute('tabindex') === '-1' || el.closest('[aria-hidden="true"]') ?
                null :
                el;
        })
        .filter(el => el !== null);
}

function hexToRgb(str: string) {
    const hex = str.match(/^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})([\da-f]{2})?$/i);
    if (hex) return hex.slice(1, 4).map(val => parseInt(val.padStart(2, val), 16));

    return [0, 0, 0];
}

export function mixColors(base: string, mixer: string, outputLength: number) {
    const colorA = hexToRgb(base);
    const colorB = hexToRgb(mixer);

    return new Array(outputLength).fill(0).map((_, i) => {
        const n = i / outputLength;

        return `#${[
            colorA[0] * (1 - n) + colorB[0] * n,
            colorA[1] * (1 - n) + colorB[1] * n,
            colorA[2] * (1 - n) + colorB[2] * n
        ].map(val => Math.round(val).toString(16)).join('')}`;
    });
}