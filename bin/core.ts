import fs from 'fs';
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { glob } from "glob";
import { extractImports, getContext, getIOHelper, IOHelper, keyFromImport, matchBrackets, replace, Stats, stripImports } from "./utils";

async function extractDependents(name: string, content: string, external = false) {
    const { dependents } = await getContext();
    name = keyFromImport(name);

    if (!(name in dependents)) dependents[name] = [];

    if (external) { // optimize
        extractImports(content, 'fluid').forEach(key => key && dependents[name].push(key));
    } else {
        Array.from(content.matchAll(/import\s+\w+\s+from\s*(?:'|").*?\/([^\/]+)(\/index)?\.js(?:'|")/g))
            .forEach(([_, entry]) => {
                if (!entry.startsWith('use')) dependents[name].push(entry);
            });
    }
}

async function createRenderableElement(components: React.FunctionComponent<any>[]) {
    const io = await getIOHelper('node_modules/@infinityfx/fluid/');
    if (!io) throw new Error('Unable to access FluidProvider module');

    const FluidProvider = await io.module('./context/fluid.js');

    const Component = components.reduce((el, Component) => {
        if ('Root' in Component) {
            el = createElement(Component.Root as any, {}, el);
        } else {
            el = createElement(Component,
                { key: 0, pages: 1, steps: [], options: [], data: [], columns: [], include: [], name: '' },
                el);
        }
    }, undefined as any);

    return createElement(FluidProvider, undefined, createElement('div', { key: 0 }, Component));
}

export async function compileFile(io: IOHelper, name: string, path: string, appendCssImport = false) {
    let contents = io.source(path);

    try {
        const components = [await io.module(path)];
        const [_, subName] = name.split('.');

        if (subName) components.unshift(await io.module(path.replace(/index\.js/, `${subName.toLowerCase()}.js`)));

        renderToString(await createRenderableElement(components));
    } catch { }

    await extractDependents(name, contents, io.parent !== 'fluid');
    contents = await processFileCSS(name, contents);
    if (appendCssImport) contents = await insertCssImport(io.parent, path, contents);

    io.output(path, stripImports(contents));
}

async function processFileCSS(name: string, content: string) {
    const { styles } = await getContext();
    const { selectors } = styles[name.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase()] || {};

    const createStyles = content.match(/import\s*\{[^{]*(createStyles(?:\s*as\s*([^\s},]+))?)[^}]*\}/);

    const match = content.match(new RegExp(`(=|,|;|\\s|:)${createStyles?.[2] || createStyles?.[1]}\\(`));
    if (match?.index) content = replace(content,
        match.index + 1,
        matchBrackets(content, match.index + match[0].length, '()') + 1,
        JSON.stringify(selectors || {}));

    const createGlobalStyles = content.match(/import\s*\{[^{]*(createGlobalStyles(?:\s*as\s*([^\s},]+))?)[^}]*\}/);
    let matches = content.matchAll(new RegExp(`(=|,|;|\\s|:)${createGlobalStyles?.[2] || createGlobalStyles?.[1]}\\(`, 'g')),
        globalStyle,
        globalStyleOffset = 0;

    while (globalStyle = matches.next().value) {
        const i = globalStyle.index + globalStyleOffset;
        let to = matchBrackets(content, i + globalStyle[0].length, '()');
        if ([';', ','].includes(content.charAt(to + 1))) to++;

        content = replace(content, i + 1, to + 1, '');
        globalStyleOffset -= to - i;
    }

    return content;
}

async function insertCssImport(base: string, path: string, contents: string) {
    const { theme, cssOutput } = await getContext();

    const context = contents.match(/import\s*\{[^{]*(GLOBAL_CONTEXT(?:\s*as\s*([^\s},]+))?)[^}]*\}/);
    contents = contents.replace(new RegExp(`${context?.[2] || context?.[1]}\\.theme`), JSON.stringify(theme));

    const cssInsert = contents.match(/(?:(?:'|")use\sclient(?:'|");\n?)?()/);

    if (cssInsert?.index === undefined || cssOutput === 'manual') return contents;

    const idx = cssInsert.index + cssInsert[0].length;
    return replace(contents, idx, idx, `import "./${path.split(/\/|\\/g).slice(2).map(() => '../').join('')}${base}.css";`);
}

// 3. ?? (figure out how to handle * import, where all components need to be included..)
// 4. ?? (check all used components before compilation??)
// 4.1 that way sub dependents of external components are accounted for in main fluid styles

async function appendFileDependents(namespace: string, file: string, map: { [key: string]: any; }) {
    const { dependents } = await getContext();

    const contents = fs.readFileSync(file, { encoding: 'ascii' });
    const imports = extractImports(contents, namespace);

    while (imports.length) {
        const entry = imports.pop();
        if (!entry) return null; // doesnt work for external imports.. (because will include everything even tho maybe not used)

        if (entry in map) continue;
        if (entry in dependents) imports.push(...dependents[entry]);

        map[entry] = true;
    }

    return map;
}

export async function emitCss(io: IOHelper, stats: Stats, omitGlobals = false) {
    const { paths, styles, cssOutput, isDev, isInternal } = await getContext();

    let usedComponents = null;

    if (!isInternal && !isDev) {
        const files = await glob(paths);

        for (const file of files) {
            usedComponents = await appendFileDependents(io.parent, file, usedComponents || {});
            if (!usedComponents) break;
        }
    }

    const stylesheet = Object.entries(styles)
        .reduce((stylesheet, [key, entry]) => {
            key = key.replace(/\.\w+$/, '');
            if (key !== '__globals' && usedComponents !== null && !(key in usedComponents)) return stylesheet;
            if (omitGlobals && key === '__globals') return stylesheet;

            stats.compiled++;
            return stylesheet += entry.rules;
        }, '');

    stats.files.push({
        name: `${io.parent}.css`,
        size: new Blob([stylesheet], { type: 'text/css' }).size
    })

    cssOutput === 'automatic' ?
        io.output(`./${io.parent}.css`, stylesheet) :
        fs.writeFileSync(process.cwd() + './fluid.css', stylesheet, {
            flag: !stats.index ? 'w' : 'a'
        });
}