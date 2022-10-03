import { mergeFallback, hash, hashObject, styleMapToRuleList } from '@infinityfx/fluid/utils';
import { matchBrackets, getAbsoluteName, evaluateStyleArgument, getValueFromObjectString, replaceByIndex, Pointer } from '../utils';
import Store from '../store';

export default function (source) {
    this.cacheable(false);

    if (this.mode !== 'production' || /node_modules\\/.test(this.resourcePath)) return source;

    if (!Store.hydrated) return source;

    const regx = new RegExp(`^${this.rootContext.replace(/\\/g, '\\\\')}(.*)$`);
    const file = this.resourcePath.match(regx);
    if (!file) return source;

    const fileHash = hash(file[0]);
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
                const componentStyles = evaluateStyleArgument(stylesArgument, source);
                if (componentStyles) mergeFallback(styleMap, componentStyles);
            }

            const key = getAbsoluteName(component[1], source, this.context);
            mergeFallback(styleMap, Store.getComponentStyles(key) || {});

            if (!Object.keys(styleMap).length) continue; // WIP MAY BREAK THINGS

            const hash = hashObject(styleMap);
            const { rules, selectors } = styleMapToRuleList(styleMap, hash);
            let insert = JSON.stringify(selectors);

            Store.insertRules(hash, rules, fileHash);

            if (!stylesArgument) {
                index++;
                insert = 'styles:' + insert + ',';
            }

            source = replaceByIndex(source, index, stylesArgument.length, insert);
            pointer.shift(stylesArgument.length - insert.length);
        } catch (ex) { }
    }

    const base = this.rootContext.replace(/\\/g, '/') + '/.next/cache/fluid/';
    let styles = `import "${base}${fileHash}.css";\n`;
    if (/_app.js$/.test(this.resourcePath)) styles += `import "${base}FLUID_GLOBAL_COMPILED_STYLES.css";\n`;

    return styles + source; // DOESNT ACTUALLY WORK CURRENTLY
    // return source;
}