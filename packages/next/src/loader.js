const matchBrackets = (str, from, open = '{', close = '}') => {
    let i = from + 1, res = open, bracket = 1;

    while (bracket > 0 && i < str.length) {
        const char = str.charAt(i);
        if (char === close) bracket--;
        if (char === open) bracket++;
        res += char;

        i++;
    }

    return res;
};

const objectFromString = (str) => {
    return JSON.parse(str.replace(/(^|,|\s)([\w\$]+?):/gi, '$1"$2":').replace(/'/g, '"'));
}

const insertInString = (str, start, end, insert) => {
    return str.slice(0, start) + insert + str.slice(end);
}

const is = {
    null: val => typeof val === 'undefined' || val === null,
    array: val => Array.isArray(val),
    object: val => !is.null(val) && typeof val === 'object' && !is.array(val),
    string: val => typeof val === 'string',
    function: val => val instanceof Function
}

const hash = (str = '') => {
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

const hashObject = (rules) => hash(JSON.stringify(rules));

const mergeFallback = (a, b) => {
    for (const key in b) {
        if (!(key in a)) a[key] = b[key];
    }

    return a;
}

const styleRuleToString = (key, val, postfix, selectors = {}) => {
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
}

const styleMapToRuleList = (rules, postfix = '') => {
    const selectors = {};

    rules = Object.keys(rules).map(key => {
        return {
            top: /^@import/.test(key),
            string: styleRuleToString(key, rules[key], postfix, selectors)
        };
    });

    return { rules, selectors };
}

const cache = {};

// TODO:
// optimize imports
// export actual css rules to file
// implement useGlobalStyles hook
// look into splitting into multiple loaders, so cache gets populated first for all files

export default function (source) {
    const cb = this.async();

    if (this.mode !== 'production' || /node_modules\\/.test(this.resourcePath)) return cb(null, source);

    const components = source.matchAll(/function\s*([\w\$]+)\(.*?\)\s*\{/gs);

    let outerOffset = 0;
    for (const component of components) {
        const name = component[1];
        const index = component.index + component[0].length - 1 - outerOffset;
        const body = matchBrackets(source, index);

        const hooks = body.matchAll(/=\s*useStyles\(/gs);

        let innerOffset = 0;
        for (const hook of hooks) {
            const subIndex = index + hook.index + hook[0].length - 1 - innerOffset;
            const args = matchBrackets(source, subIndex, '(', ')').slice(1, -1);

            let styles;
            if (args.charAt(0) === '{') {
                try {
                    styles = objectFromString(args);
                } catch (ex) { }
            } else {
                let match = args.match(/(?:\(\)\s*=>\s*|^)(?:\{\s*return\s*)?mergeFallback\(styles,\s*(.+?)\)(?:;?\s*\}|$)/s);
                if (match) {
                    const identifier = match[1];
                    const parts = identifier.split(/(\.|\[('|")|('|")\])/g);

                    const regx = new RegExp(`(var|let|const)\\s*${parts[0]}\\s*=\\s*\\{`, 's');
                    const subMatch = regx.exec(source);
                    if (subMatch) {
                        const i = subMatch.index + subMatch[0].length - 1;

                        try {
                            let obj = objectFromString(matchBrackets(source, i));

                            for (let i = 1; i < parts.length; i++) obj = obj[parts[i]];

                            styles = obj;
                        } catch (ex) { }
                    }
                }
            }

            if (styles) {
                cache[name] = styles;

                const start = index + hook.index - innerOffset;
                const length = args.length + hook[0].length + 1;
                source = insertInString(source, start, start + length, '= styles');
                innerOffset += length - 8;
                outerOffset += length - 8;
            }
        }
    }

    const jsx = source.matchAll(/_jsxs?\(\s*([\w]+?)\s*,\s*\{/gs);

    let offset = 0;
    for (const component of jsx) {
        const name = component[1];
        let index = component.index + component[0].length - 1 - offset;
        const props = matchBrackets(source, index);
        const match = /"?styles"?:\s*\{/gs.exec(props);

        try {
            const styleMap = {};
            let styles = '';

            if (match) {
                index += match.index + match[0].length - 1;
                styles = matchBrackets(source, index);
                const componentStyles = objectFromString(styles);
                mergeFallback(styleMap, componentStyles);
            }

            mergeFallback(styleMap, cache[name] || {});
            const hash = hashObject(styleMap);

            const { rules, selectors } = styleMapToRuleList(styleMap, hash);
            let insert = JSON.stringify(selectors);

            if (!match) {
                index++;
                insert = 'styles:' + insert + ',';
            }

            source = insertInString(source, index, index + styles.length, insert);
            offset += styles.length - insert.length;
        } catch (ex) { }
    }

    // this.emitFile(`test_${Math.random()}.json`, JSON.stringify(cache));

    cb(null, source);
}