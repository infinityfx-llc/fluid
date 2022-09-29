export const tag = () => Math.random().toString(16).slice(2, 10);

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