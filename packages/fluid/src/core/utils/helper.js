export const hash = (str = '') => {
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
};

export const is = {
    null: val => typeof val === 'undefined' || val === null,
    array: val => Array.isArray(val),
    object: val => !is.null(val) && typeof val === 'object' && !is.array(val),
    string: val => typeof val === 'string',
    function: val => val instanceof Function
};

export const cloneMergeDeep = (a = {}, b = {}) => {
    const result = {};

    const keys = Object.keys(a).concat(Object.keys(b));
    for (const key of keys) {
        let val = key in b ? b[key] : a[key];
        val = is.object(val) ? cloneMergeDeep(a[key], b[key]) : val;
        result[key] = is.array(val) ? val.slice() : val;
    }

    return result;
};

export const mergeFallback = (a, b) => {
    for (const key in b) {
        if (!(key in a)) a[key] = b[key];
    }

    return a;
};

export const hexToRgba = hex => {
    const [_, r, g, b] = hex.match(/^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})([\da-f]{2})?/i);
    const t = val => is.null(val) ? 127 : parseInt(val.padStart(2, val), 16);

    return { r: t(r), g: t(g), b: t(b) };
};

export const strToRgba = str => {
    const [_, r, g, b] = str.match(/^rgba?\((\d+)\D+(\d+)\D+(\d+)\D*(\d+)?\)/i);
    const t = val => is.null(val) ? 127 : parseInt(val);

    return { r: t(r), g: t(g), b: t(b) };
};

export const strToColor = str => {
    if (/^rgba?\(.*\)$/i.test(str)) return strToRgba(str);
    if (/^#[0-9a-f]{3,8}$/i.test(str)) return hexToRgba(str);

    return { r: 127, g: 127, b: 127 };
};

export const colorToRgb = clr => {
    return `${clr.r}, ${clr.g}, ${clr.b}`;
};

export const colorToHex = clr => {
    const t = val => val.toString(16).padStart(2, '0');

    return `#${t(clr.r)}${t(clr.g)}${t(clr.b)}`
};