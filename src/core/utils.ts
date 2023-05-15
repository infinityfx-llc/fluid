import { Selectors } from "../types";

export const round = (val: number, n = 2) => Math.round(val * Math.pow(10, n)) / Math.pow(10, n);

export const toNumber = (val: any, fallback: number): number => {
    val = typeof val === 'string' ? parseFloat(val) : val;
    return val === undefined || isNaN(val) ? fallback : val;
}

type SharedKeys<T, P> = keyof Omit<T | P, keyof (Omit<T, keyof P> & Omit<P, keyof T>)>;

type MergeObjects<T, P> = T & P & { [K in SharedKeys<T, P>]: Merged<T[K], P[K]> };

type Merged<T, P> = [T, P] extends [{ [key: string]: unknown }, { [key: string]: unknown }] ? MergeObjects<T, P> : T & P;

export function mergeRecursive<T = any, P = any>(a: T, b: P) {
    if (a === undefined) return b as Merged<T, P>;
    if (typeof a !== 'object') return a as Merged<T, P>;

    const merged: any = Object.assign({}, a);
    for (const key in b) {
        merged[key] = mergeRecursive(merged[key], b[key]);
    }

    return merged as Merged<T, P>;
}

export function classes(...args: any[]) {
    return args.filter(val => typeof val === 'string').join(' ');
}

export function combineRefs(...refs: React.Ref<any>[]) {
    return (el: any) => {
        refs.forEach(ref => {
            if (ref && 'current' in ref) (ref as React.MutableRefObject<any>).current = el;
            if (ref instanceof Function) ref(el);
        });
    };
}

export function ruleToString(selector: string, rules: React.CSSProperties | { [key: string]: React.CSSProperties }, selectors: Selectors, postfix?: string): string {
    const prefixed = postfix ?
        selector.split(/((?::global\()?[.#][\w\-_][\w\d\-_]*)/gi)
            .reduce((prefixed, seg) => {
                if (/^[.#]/.test(seg)) {
                    const name = seg.slice(1);
                    selectors[name] = `${name}__${postfix}`;
                    seg = `${seg}__${postfix}`;
                }

                return prefixed + seg;
            }, '') : selector;

    return `${prefixed}{${Object.entries(rules).reduce((str, [attr, value]) => {
        if (typeof value === 'object') return str + ruleToString(attr, value, selectors, postfix);

        return str + `${attr.replace(/(.?)([A-Z])/g, '$1-$2').toLowerCase()}:${value};`;
    }, '')}}`;
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