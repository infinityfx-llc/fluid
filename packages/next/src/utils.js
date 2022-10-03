export const matchBrackets = (str, start, open = '{', close = '}') => {
    let i = start + 1, res = open, bracket = 1;

    while (bracket > 0 && i < str.length) {
        const char = str.charAt(i);
        if (char === close) bracket--;
        if (char === open) bracket++;
        res += char;

        i++;
    }

    return res;
};

export const objectFromString = (str) => {
    return JSON.parse(str.replace(/(^|,|\s)([\w\$]+?):/gi, '$1"$2":').replace(/'/g, '"'));
};

export const evaluateIdentifier = (str, identifier) => { // also take into account imports
    const parts = identifier.split(/(\.|\[('|")|('|")\])/g);

    const regx = new RegExp(`(var|let|const)\\s*${parts[0]}\\s*=\\s*\\{`, 's');
    const match = regx.exec(str);

    if (match) {
        const i = match.index + match[0].length - 1;

        try {
            let obj = objectFromString(matchBrackets(str, i));

            for (let i = 1; i < parts.length; i++) {
                obj = obj[parts[i]];
            }

            return obj;
        } catch (ex) { }
    }

    return null;
};

export const evaluateStyleArgument = (args, source) => {

    try {
        if (/^\{.*\}$/s.test(args)) {
            return objectFromString(args);
        } else {
            let match = args.match(/(?:\(\)\s*=>\s*|^)(?:\{\s*return\s*)?mergeFallback\(styles,\s*(.+?)\)(?:;?\s*\}|$)/s);
            if (match) return evaluateIdentifier(source, match[1]);

            match = args.match(/^[\w][\w\$]*/);
            if (match) return evaluateIdentifier(source, match[0]);

            // if needing to find identifier delete original identifier definition
        }
    } catch (ex) {
        return null;
    }
};

export const getValueFromObjectString = (object, key) => {
    let str = '', bracket = 0;

    for (let i = 0; i < object.length; i++) {
        const char = object[i];
        if (char === '{') {
            if (bracket === 1) str += '{';
            bracket++;
        }
        if (char === '}') {
            if (bracket === 2) str += '}';
            bracket--;
        }

        str += bracket < 2 ? char : '_';
    }

    const regx = new RegExp(`("?${key}"?:\\s*)(.+?)(?:,|\\s|\\})`, 's');
    const match = str.match(regx);

    if (match) {
        const start = match.index + match[1].length;
        const end = start + match[2].length;

        return [object.slice(start, end), start];
    }

    return [null, 0];
};

export const Pointer = (index = 0) => {
    const pointer = {
        offset: 0,
        base: index,
        start: index,
        end: index,
        update: (match) => {
            pointer.start = pointer.base + match.index - pointer.offset;
            pointer.end = pointer.start + match[0].length - 1;
        },
        shift: (amount) => {
            pointer.offset += amount;
            pointer.start -= amount;
            pointer.end -= amount;
        }
    };

    return pointer;
}

export const replaceByIndex = (str, start, length, insert = '') => {
    return str.slice(0, start) + insert + str.slice(start + length);
};

export const toAbsoluteName = (name, context) => {
    return context.replace(/\\/g, '/') + '/' + name;
}

export const getAbsoluteName = (name, source, context = './') => {
    const regx = new RegExp(`import\\s*\\{?.*?${name}(?:\\sas\\s(.+?)(?:\\s|,|\\}))?.*?\\}?\\s*from\\s*(?:'|")(.+?)(?:'|")`);
    const [_, alias, modulePath] = source.match(regx) || [];

    if (!modulePath) return null;

    const path = require.resolve(modulePath, { // do es module resolving as well
        paths: [context]
    });

    return path.replace(/\\/g, '/').replace(/(\\|\/)[^\\\/]+$/, '/' + (alias || name));
};