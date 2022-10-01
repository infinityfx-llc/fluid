import { mergeFallback, hashObject, styleMapToRuleList } from '@infinityfx/fluid/utils';
import { matchBrackets, objectFromString, insertInString } from '../utils';
import Cache from '../cache';

export default function (source) {
    this.cacheable(false);

    if (this.mode !== 'production' || /node_modules\\/.test(this.resourcePath)) return source;

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

            mergeFallback(styleMap, Cache[name] || {});
            const hash = hashObject(styleMap);

            const { rules, selectors } = styleMapToRuleList(styleMap, hash);
            let insert = JSON.stringify(selectors);
            Cache.rules[hash] = rules;

            if (!match) {
                index++;
                insert = 'styles:' + insert + ',';
            }

            source = insertInString(source, index, index + styles.length, insert);
            offset += styles.length - insert.length;
        } catch (ex) { }
    }

    const cssString = Object.values(Cache.rules)
        .reduce((str, rules) => {
            return str + rules.map(({ string }) => string).join('');
        }, '');

    
    // this._compilation.emitAsset();

    // this.emitFile(`test_${Math.random()}.css`, cssString);

    return source;
}