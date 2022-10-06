import { mergeFallback, hash, hashObject, styleMapToRuleList } from '@infinityfx/fluid/utils';
import { matchBrackets, getAbsoluteName, evaluateStyleArgument, getValueFromObjectString, replaceByIndex, Pointer } from '../utils';
import Store from '../store';

export default function (source) {
    this.cacheable(false);

    if (this.mode !== 'production' || /node_modules\\/.test(this.resourcePath)) return source;

    if (!Store.hydrated) return source;

    const regx = new RegExp(`^${this.rootContext.replace(/\\/g, '\\\\')}`);
    const fileHash = hash(this.resourcePath.replace(regx, ''));

    if (Store.bundled) {
        const base = this.rootContext.replace(/\\/g, '/') + '/.next/cache/fluid/';
        if (!Store.scopeIsEmpty(fileHash)) return `import "${base}${fileHash}.css";\n` + source;

        return source;
    }

    const jsx = source.matchAll(/_jsxs?\(\s*([\w]+?)\s*,\s*\{/gs);

    const pointer = Pointer();
    for (const component of jsx) {
        pointer.update(component);
        const props = matchBrackets(source, pointer.end);
        let [stylesArgument, index] = getValueFromObjectString(props, 'styles');
        index += pointer.end;

        try {
            const styleMap = {};

            if (stylesArgument) {
                const instanceStyles = evaluateStyleArgument(stylesArgument, source);
                if (instanceStyles) mergeFallback(styleMap, instanceStyles);
            }

            const key = getAbsoluteName(component[1], source, this.context);
            mergeFallback(styleMap, Store.getComponentStyles(key) || {});

            if (!Object.keys(styleMap).length) continue;

            const hash = hashObject(styleMap);
            const { rules, selectors } = styleMapToRuleList(styleMap, hash);
            let insert = JSON.stringify(selectors);

            Store.setScopedRules(fileHash, hash, rules);

            if (!stylesArgument) {
                index++;
                insert = 'styles:' + insert + ',';
                stylesArgument = { length: 0 };
            }

            source = replaceByIndex(source, index, stylesArgument.length, insert);
            pointer.shift(stylesArgument.length - insert.length);
        } catch (ex) { }
    }

    return source;
}