import { matchBrackets, evaluateStyleArgument, replaceByIndex, Pointer, toAbsoluteName } from '../utils';
import Store from '../store';

export default function (source) {
    this.cacheable(false);

    if (this.mode !== 'production' || /node_modules\\/.test(this.resourcePath)) return source;

    if (Store.hydrated) return source;

    const components = source.matchAll(/function\s+([\w\$]+?)\(.*?\)\s*\{/gs);
    const pointer = Pointer();

    for (const component of components) {
        pointer.update(component);

        const body = matchBrackets(source, pointer.end);
        const props = component[2];

        const hooks = body.matchAll(/(=\s*useStyles|useGlobalStyles)\(/gs); // parse fonts
        const subPointer = Pointer(pointer.end);

        for (const hook of hooks) {
            subPointer.update(hook);

            const args = matchBrackets(source, subPointer.end, '(', ')').slice(1, -1);
            const styles = evaluateStyleArgument(args, source);

            if (styles) {
                const isGlobal = /^useGlobal/.test(hook[0]);
                const key = toAbsoluteName(component[1], this.context);

                Store.insertStyles(isGlobal ? null : key, styles);

                let length = args.length + hook[0].length + 1;
                if (source.charAt(subPointer.start + length + 1) === ';') length++;

                // if props is not defined immediatley replace with classnames

                let insert = '';
                if (!isGlobal) {
                    if (/^\{.*\}$/.test(props) && props.includes('styles')) {
                        insert = '= styles;';
                    } else {
                        insert = `= ${props}.styles;`;
                    }
                }
                source = replaceByIndex(source, subPointer.start, length, insert);

                subPointer.shift(length - insert.length);
                pointer.shift(length - insert.length);
            }
        }
    }

    return source;
}