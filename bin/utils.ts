import { createElement } from "react";
import { renderToString } from "react-dom/server";
import fs from 'fs';
import { FluidConfig } from "../src/types";
import { STYLE_CONTEXT } from "../src/core/style";
import packageJson from '../package.json';
import readline from 'readline';

export function getRoots() {
    let isSelf = false;

    try {
        const packageJson = fs.readFileSync('./package.json', { encoding: 'ascii' });
        isSelf = JSON.parse(packageJson).name === '@infinityfx/fluid';
    } catch (err) { }

    return {
        output: isSelf ? './compiled/' : `./node_modules/${packageJson.name}/compiled/`,
        dist: isSelf ? './dist/' : `./node_modules/${packageJson.name}/dist/`,
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

function removeImports(content: string) {
    return content.replace(/import[^;]*?core(?:\/|\\)style\.js(?:"|');?/gs, '');
}

export function sanitizeImports() {
    const { dist, output } = getRoots();

    for (const file of ['index.js', 'hooks.js']) {
        const content = fs.readFileSync(dist + file, { encoding: 'ascii' })
            .replace(/\.\/compiled/g, '');

        fs.writeFileSync(dist + file, content);
    }

    if (fs.existsSync(output)) fs.rmSync(output, { recursive: true });
    fs.cpSync(dist, output, { recursive: true });
}

export function compileImports() {
    const { dist } = getRoots();

    for (const file of ['index.js', 'hooks.js']) {
        const content = fs.readFileSync(dist + file, { encoding: 'ascii' })
            .replace(/(from\s*(?:'|"))\.\/(.*?(?:'|");)/g, '$1../compiled/$2');

        fs.writeFileSync(dist + file, content);
    }
}

function insertThemedStyles(contents: string) {
    const { output } = getRoots();

    const context = contents.match(/import\s*\{[^{]*(STYLE_CONTEXT(?:\s*as\s*([^\s},]+))?)[^}]*\}/s);
    contents = contents.replace(new RegExp(`${context?.[2] || context?.[1]}\\.THEME`, 's'), JSON.stringify(STYLE_CONTEXT.THEME));

    const cssInsert = contents.match(/(?:(?:'|")use\sclient(?:'|");\n?)?()/s);
    if (cssInsert?.index === undefined) return contents;

    const idx = cssInsert.index + cssInsert[0].length,
        stylesheet = Object.values(STYLE_CONTEXT.STYLES)
            .reduce((stylesheet, entry) => stylesheet += entry.rules, '');

    fs.writeFileSync(output + '/fluid.css', stylesheet);
    return contents.slice(0, idx) + 'import "../fluid.css";' + contents.slice(idx);
}

function createRenderableElement(components: any, name: string, parent?: any) {
    const Component = parent ? parent[name.replace(/.*\./, '')] : components[name.replace(/.*\./, '')];

    let Element: any = createElement(Component, { key: 0, pages: 1, steps: [], options: [], data: [], columns: [], include: [], name: '' }, '');

    if (parent && !name.includes('Root')) Element = createElement(parent.Root, {}, Element);

    return createElement(components.FluidProvider, undefined, createElement('div', { key: 0 }, Element));
}

export async function compileStyles() {
    const { dist } = getRoots();
    const COMPONENTS = await import('../src/index');

    const imports = Array.from(fs.readFileSync(dist + 'index.js', { encoding: 'ascii' })
        .matchAll(/as\s*(.+?)\s*\}\s*from\s*(?:'|")(.+?)(?:'|");/g));

    for (let i = 0; i < imports.length; i++) {

        const [_, name, path] = imports[i];

        if (/index.js$/.test(path)) {
            const Component = (COMPONENTS as any)[name.replace(/.*\./, '')];

            for (const subName in Component) {
                const localPath = path.replace(/index\.js/, `${subName.toLowerCase()}.js`);

                await processFile(`${name}.${subName}`, localPath, COMPONENTS, Component);
            }
        } else
            if (!/context\/fluid\.js$/.test(path)) {
                await processFile(name, path, COMPONENTS);
            }

        const total = imports.length - 1;
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${(i / total * 100).toFixed(1)}% ` + new Array(Math.round(i / total * 40)).fill('=').join(''));
    }

    await processFile('FluidProvider', './context/fluid.js', COMPONENTS)
}

async function processFile(name: string, path: string, components: any, parent?: any) {
    const { output, dist } = getRoots();

    let contents = fs.readFileSync(dist + path, { encoding: 'ascii' }),
        Element = createRenderableElement(components, name, parent);

    contents = await processStyles(name, contents, Element);
    if (name === 'FluidProvider') contents = insertThemedStyles(contents);

    fs.writeFileSync(output + path, removeImports(contents));
}

async function processStyles(name: string, content: string, Element: any) {
    try { renderToString(Element); } catch (ex) { }

    const { selectors } = STYLE_CONTEXT.STYLES[name.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase()] || {};

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