import { createElement } from "react";
import { renderToString } from "react-dom/server";
import fs from 'fs';
import { FluidConfig } from "../src/types";
import FluidProvider from "../src/context/fluid";
import { DIST_ROOT, OUTPUT_ROOT } from "./const";
import { STYLE_CONTEXT } from "../src/core/style";

let fluidConfig: FluidConfig;

export async function getConfig() {
    try {
        if (!fluidConfig) {
            fluidConfig = (await import('file://' + process.cwd() + '/fluid.config.js' as any)).default;
        }
    } catch (ex) {
        fluidConfig = {};
    }

    return fluidConfig;
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

function insertTheme(content: string) {
    const context = content.match(/import\s*\{[^{]*(STYLE_CONTEXT(?:\s*as\s*([^\s},]+))?)[^}]*\}/s);

    return content.replace(new RegExp(`${context?.[2] || context?.[1]}\\.THEME`, 's'), JSON.stringify(STYLE_CONTEXT.THEME));
}

export async function processFile(root: string, path: string, name: string, componentMap: any) {
    let fileContent = fs.readFileSync(DIST_ROOT + root + path, { encoding: 'ascii' });
    const [outputPath, filename] = (OUTPUT_ROOT + root + path).split(/([^\/\\]*?$)/);

    const names = name.split('.');
    const Component = componentMap[names[names.length - 1]];

    let global = false;
    if (/context\/fluid.js$/.test(path)) {
        fileContent = insertTheme(fileContent);
        global = true;
    }

    if (/index.js$/.test(path)) {
        for (const subName in Component) {
            await processFile(path.replace(/[^\/\\]*?$/, ''), `./${subName.toLowerCase()}.js`, `${name}.${subName}`, Component);
        }
    }

    if (Component && (Component instanceof Function || 'render' in Component)) {
        let reactElement: any = createElement(Component, { key: 0, steps: [], options: [], data: [], columns: [], include: [], name: '' }, '');
        if ('Root' in componentMap && !name.includes('Root')) reactElement = createElement(componentMap.Root, {}, reactElement);

        fileContent = await emitCSS(name.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase(), reactElement, fileContent, outputPath, global);
    }

    fs.writeFileSync(outputPath + filename, fileContent);
}

export async function emitCSS(name: string, Component: React.ReactElement, content: string, outputPath: string, global: boolean) {
    try {
        const context = createElement(FluidProvider, undefined,
            createElement('div', { key: 0 }, global ? undefined : Component)
        );

        renderToString(context);
    } catch (ex) { }

    const { rules, selectors } = STYLE_CONTEXT.STYLES[global ? 'globals' : name] || {};

    const cssInsert = content.match(/(?:(?:'|")use\sclient(?:'|");\n?)?()/s);
    if (cssInsert?.index !== undefined && rules) {
        const idx = cssInsert.index + cssInsert[0].length;

        content = content.slice(0, idx) + `import "./${global ? 'globals' : name}.css";` + content.slice(idx);
        fs.writeFileSync(outputPath + `/${global ? 'globals' : name}.css`, rules);
    }

    const createStyles = content.match(/import\s*\{[^{]*(createStyles(?:\s*as\s*([^\s},]+))?)[^}]*\}/);

    const match = content.match(new RegExp(`(=|,|;|\\s|:)${createStyles?.[2] || createStyles?.[1]}\\(`, 's'));
    if (match?.index && rules) {
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

    return content.replace(/import[^;]*?core(?:\/|\\)style\.js(?:"|');?/gs, '');
}