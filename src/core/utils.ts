import { Selectors } from "../types";

export const round = (val: number, n = 2) => Math.round(val * Math.pow(10, n)) / Math.pow(10, n);

export const toNumber = (val: any, fallback: number): number => {
    val = typeof val === 'string' ? parseFloat(val) : val;
    return val === undefined || isNaN(val) ? fallback : val;
}

export function mergeRecursive(a: any, b: any) {
    if (a === undefined) return b;
    if (typeof a !== 'object') return a;

    const merged: any = Object.assign({}, a);
    for (const key in b) {
        merged[key] = mergeRecursive(merged[key], b[key]);
    }

    return merged;
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