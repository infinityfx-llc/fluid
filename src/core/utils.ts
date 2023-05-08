import { Selectors } from "../types";

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
};

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

        return str + `${attr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}:${value};`;
    }, '')}}`;
}