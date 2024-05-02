import { createElement } from "react";
import { renderToString } from "react-dom/server";
import fs from 'fs';
import { FluidConfig } from "../src/types";
import { STYLE_CONTEXT } from "../src/core/style";
import packageJson from '../package.json';
import { glob } from "glob";

export function getRoots() {
    let isInternal = false;

    try {
        const packageJson = fs.readFileSync('./package.json', { encoding: 'ascii' });
        isInternal = JSON.parse(packageJson).name === '@infinityfx/fluid';
    } catch (err) { }

    return {
        isInternal,
        output: isInternal ? './compiled/' : `./node_modules/${packageJson.name}/compiled/`,
        dist: isInternal ? './dist/' : `./node_modules/${packageJson.name}/dist/`,
    };
}

export async function getConfig(): Promise<FluidConfig> {
    try {
        return (await import('file://' + process.cwd() + '/fluid.config.js' as any)).default;
    } catch (ex) {
        return {};
    }
}

function matchBrackets(content: string, start: number, type: '{}' | '()' | '[]' = '{}') {
    let count = 1;

    while (count > 0) {
        if (content.charAt(start) === type.charAt(0)) count++;
        if (content.charAt(start) === type.charAt(1)) count--;
        if (count > 0) start++;
    }

    return start;
}

const keyFromImport = (str: string) => str
    .replace(/^\s+|\s+(as\s+.+)?$/g, '')
    .replace(/([a-z])([A-Z])/, '$1-$2')
    .toLowerCase();

function removeImports(content: string) {
    return content.replace(/import[^;]*?core(?:\/|\\)style\.js(?:"|');?/gs, '');
}

function getDependents(content: string) {
    return Array.from(content.matchAll(/import\s+\w+\s+from\s*(?:'|").*?\/([^\/]+)(\/index)?\.js(?:'|")/gs))
        .map(entry => keyFromImport(entry[1]))
        .filter(entry => !entry.startsWith('use'));
}

function createRenderableElement(components: any, name: string, parent?: any) {
    const Component = parent ? parent[name.replace(/.*\./, '')] : components[name.replace(/.*\./, '')];

    let Element: any = createElement(Component, { key: 0, pages: 1, steps: [], options: [], data: [], columns: [], include: [], name: '' }, '');

    if (parent && !name.includes('Root')) Element = createElement(parent.Root, {}, Element);

    return createElement(components.FluidProvider, undefined, createElement('div', { key: 0 }, Element));
}

async function emitCss() {
    const { isInternal, output } = getRoots();
    let usedComponents: {
        [key: string]: boolean;
    } | null = null;

    if (!isInternal) {
        const files = await glob(STYLE_CONTEXT.PATHS);
        usedComponents = {};

        outer: for (const file of files) {
            const contents = fs.readFileSync(file, { encoding: 'ascii' });

            const imports = Array.from(contents.matchAll(/import\s*(?:\{([^\}]+)\}|\*\s+as.*|\w+)\s*from\s*(?:'|")@infinityfx\/fluid(?:'|")/gs));

            for (const entry of imports) {
                const components = entry[1];

                if (!components) {
                    usedComponents = null;

                    break outer;
                }

                const dependents = components.split(',').map(entry => keyFromImport(entry));

                while (dependents.length) {
                    const key = dependents.pop() as string;

                    if (!(key in usedComponents) && key in STYLE_CONTEXT.DEPENDENTS) {
                        dependents.push(...STYLE_CONTEXT.DEPENDENTS[key]);
                    }

                    (usedComponents as any)[key] = true;
                }
            }
        }
    }

    const stylesheet = Object.entries(STYLE_CONTEXT.STYLES)
        .reduce((stylesheet, [key, entry]) => {
            key = key.replace(/\..+$/, '');
            if (key !== '__globals' && usedComponents !== null && !(key in usedComponents)) return stylesheet;

            return stylesheet += entry.rules
        }, '');

    fs.writeFileSync(output + '/fluid.css', stylesheet);
}

async function insertThemedStyles(contents: string) {
    const context = contents.match(/import\s*\{[^{]*(STYLE_CONTEXT(?:\s*as\s*([^\s},]+))?)[^}]*\}/s);
    contents = contents.replace(new RegExp(`${context?.[2] || context?.[1]}\\.THEME`, 's'), JSON.stringify(STYLE_CONTEXT.THEME));

    const cssInsert = contents.match(/(?:(?:'|")use\sclient(?:'|");\n?)?()/s);
    if (cssInsert?.index === undefined) return contents;

    await emitCss();

    const idx = cssInsert.index + cssInsert[0].length;
    return contents.slice(0, idx) + 'import "../fluid.css";' + contents.slice(idx);
}

export async function processFile(name: string, path: string, components: any, parent?: any) {
    const { output, dist } = getRoots();

    let contents = fs.readFileSync(dist + path, { encoding: 'ascii' }),
        Element = createRenderableElement(components, name, parent);

    STYLE_CONTEXT.DEPENDENTS[keyFromImport(name)] = getDependents(contents);

    contents = await processStyles(name, contents, Element);
    if (name === 'FluidProvider') contents = await insertThemedStyles(contents);

    fs.writeFileSync(output + path, removeImports(contents));
}

async function processStyles(name: string, content: string, Element: any) {
    try { renderToString(Element); } catch (ex) { }

    const { selectors } = STYLE_CONTEXT.STYLES[keyFromImport(name)] || {};

    const createStyles = content.match(/import\s*\{[^{]*(createStyles(?:\s*as\s*([^\s},]+))?)[^}]*\}/);

    const match = content.match(new RegExp(`(=|,|;|\\s|:)${createStyles?.[2] || createStyles?.[1]}\\(`, 's'));
    if (match?.index) {
        const to = matchBrackets(content, match.index as number + match[0].length, '()');
        content = content.slice(0, match.index + 1) + JSON.stringify(selectors || {}) + content.slice(to + 1);
    }

    const createGlobalStyles = content.match(/import\s*\{[^{]*(createGlobalStyles(?:\s*as\s*([^\s},]+))?)[^}]*\}/);
    let matches = content.matchAll(new RegExp(`(=|,|;|\\s|:)${createGlobalStyles?.[2] || createGlobalStyles?.[1]}\\(`, 'gs')), globalStyle, globalStyleOffset = 0;

    while (globalStyle = matches.next().value) {
        const i = globalStyle.index + globalStyleOffset;
        let to = matchBrackets(content, i + globalStyle[0].length, '()'), next = content.charAt(to + 1);
        if (next === ';' || next === ',') to++;

        content = content.slice(0, i + 1) + content.slice(to + 1);
        globalStyleOffset -= (to - i);
    }

    return content;
}