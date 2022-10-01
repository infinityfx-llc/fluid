import { hash, is } from './helper';

export const hashObject = (rules) => hash(JSON.stringify(rules));

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

    if (is.null(val)) return key + ';';

    if (is.array(val)) {
        return val.reduce((str, val) => str + styleRuleToString(key, val, postfix, selectors), '');
    }

    if (is.object(val)) {
        val = Object.entries(val).reduce((str, [key, val]) => str + styleRuleToString(key, val, postfix, selectors), '');
        return `${key}{${val}}`;
    }

    return `${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}:${val};`;
};

export const styleMapToRuleList = (rules, postfix = '') => {
    const selectors = {};

    rules = Object.keys(rules).map(key => {
        return {
            top: /^@import/.test(key),
            string: styleRuleToString(key, rules[key], postfix, selectors)
        };
    });

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

export const fontSetToStyleMap = (fonts) => {
    const styles = { '@font-face': [] };
    const uris = [];

    for (const key in fonts) {
        const font = fonts[key];

        if (is.array(font)) {
            font.forEach(face => {
                styles['@font-face'].push({
                    fontFamily: `'${key}'`,
                    fontWeight: face.weight || 300,
                    fontDisplay: 'swap',
                    src: `url("${face.src}") format('${(face.src.match(/\.([a-z0-9]+)$/i) || [0, 'woff'])[1]}')`
                });

                const host = face.src.match(/(https?:\/\/.+?)(?:\/|$)/i);
                if (host) uris.push(host[1]);
            });
        }

        if (is.string(font)) {
            styles[`@import url('${font}')`] = null;
        }
    }

    if (!styles['@font-face'].length) delete styles['@font-face'];

    return { styles, uris };
};

export const combine = (...selectors) => {
    return selectors.filter(selector => !is.null(selector)).join(' ');
};