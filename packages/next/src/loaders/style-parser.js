import { matchBrackets, objectFromString, insertInString } from '../utils';
import Cache from '../cache';

export default function (source) {
    this.cacheable(false);
    
    if (this.mode !== 'production' || /node_modules\\/.test(this.resourcePath)) return source;

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
                Cache[name] = styles;

                const start = index + hook.index - innerOffset;
                const length = args.length + hook[0].length + 1;
                source = insertInString(source, start, start + length, '= styles');
                innerOffset += length - 8;
                outerOffset += length - 8;
            }
        }
    }

    return source;
}