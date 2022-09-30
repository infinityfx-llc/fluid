import { hash, is } from './helper';

export const hashStyleMap = (rules) => hash(JSON.stringify(rules));

export const styleRuleToString = (key, val, postfix, selectors = {}) => {
    key = key.split(/((?::global\()?[.#][a-z\-_][a-z0-9\-_]*)/gi);
    key = key.reduce((str, val) => {
        if (postfix.length && /^[.#]/.test(val)) {
            const key = val.slice(1), selector = `${key}__${postfix}`;
            selectors[key] = selector;
            val = `${val.charAt(0)}${selector}`;
        }

        return str + val;
    }, '');

    if (is.object(val)) {
        val = Object.entries(val).reduce((str, [key, val]) => str + styleRuleToString(key, val, postfix, selectors), '');
        return `${key}{${val}}`;
    }

    return `${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}:${val};`; // val convert camel to kebab case
};

export const styleMapToRuleList = (rules, postfix = '') => {
    const selectors = {};

    rules = Object.keys(rules).map(key => styleRuleToString(key, rules[key], postfix, selectors));

    return { rules, selectors };
};

export const parseVariables = (map, prefix = 'fluid', vars = {}) => {
    for (const key in map) {
        if (is.array(map[key])) {
            for (let i = 0; i < map[key].length; i++) {
                vars[`--${prefix}-${key}-${(i + 1) * 100}`] = map[key][i];
            }
        } else {
            vars[`--${prefix}-${key}`] = map[key];
        }
    }

    return vars;
};

export const combine = (...selectors) => {
    return selectors.filter(selector => !is.null(selector)).join(' ');
};