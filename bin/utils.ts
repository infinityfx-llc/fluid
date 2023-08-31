import FluidStyleStore from "../src/core/stylestore";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import fs from 'fs';
import { FluidConfig } from "../src/types";
import FluidProvider from "../src/context/fluid";
import { DIST_ROOT, OUTPUT_ROOT } from "./const";
import { mergeRecursive } from "../src/core/utils";
import { DEFAULT_THEME } from "../src/core/theme";

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

export async function processFile(root: string, path: string, name: string, componentMap: any, stylesMap: any) {
    let fileContent = fs.readFileSync(DIST_ROOT + root + path, { encoding: 'ascii' });
    const [outputPath, filename] = (OUTPUT_ROOT + root + path).split(/([^\/\\]*?$)/);
    const Component = componentMap[name];

    const styles: any = name in stylesMap ? stylesMap[name] : {};

    let global = false;
    if (/context\/fluid.js$/.test(path)) {
        fileContent = await insertTheme(fileContent);
        global = true;
    }

    if (/index.js$/.test(path)) {
        for (const name in Component) {
            await processFile(path.replace(/[^\/\\]*?$/, ''), `./${name.toLowerCase()}.js`, name, Component, styles);
        }
    }

    if (Component && (Component instanceof Function || 'render' in Component)) {
        let reactElement: any = createElement(Component, { styles, key: 0, steps: [], options: [], data: [], columns: [], include: [], name: '' }, '');
        if ('Root' in componentMap && name !== 'Root') reactElement = createElement(componentMap.Root, {}, reactElement);

        fileContent = await emitCSS(name, reactElement, fileContent, outputPath, global);
    }

    fs.writeFileSync(outputPath + filename, fileContent);
}

async function insertTheme(content: string) {
    const config = await getConfig();

    const mergeRecursiveImport = content.match(/import\s*\{[^{]*(mergeRecursive(?:\s*as\s*([^\s}]+))?)[^}]*\}/);
    let match = content.match(new RegExp(`(=|,|;|\\s|:)${mergeRecursiveImport?.[mergeRecursiveImport.length - 1]}\\(`, 's'));

    if (match?.index) {
        const merged = mergeRecursive(config.theme, DEFAULT_THEME);
        const to = matchBrackets(content, match.index as number + match[0].length, '()');

        content = content.slice(0, match.index + 1) + JSON.stringify(merged) + content.slice(to + 1);
    }

    const insertionEffectImport = content.match(/import\s*\{[^{]*(useInsertionEffect(?:\s*as\s*([^\s},]+))?)[^}]*\}/);
    match = content.match(new RegExp(`(=|,|;|\\s|:)${insertionEffectImport?.[insertionEffectImport.length - 1]}\\(`, 's'));

    if (match?.index) {
        let to = matchBrackets(content, match.index as number + match[0].length, '()'), next = content.charAt(to + 1);
        if (next === ';' || next === ',') to++;
        content = content.slice(0, match.index + 1) + content.slice(to + 1);
    }

    return content;
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

export async function emitCSS(name: string, Component: React.ReactElement, content: string, outputPath: string, global: boolean) {
    // FluidStyleStore.modularize = false;
    const config = await getConfig();

    try {
        const context = createElement(FluidProvider, { theme: config.theme } as any,
            createElement('div', { key: 0 }, global ? undefined : Component)
        );

        renderToString(context);
    } catch (ex) { }

    const rules = Object.values(FluidStyleStore.rules);

    if (rules.length) {
        const cssInsert = content.match(/(?:(?:'|")use\sclient(?:'|");\n?)?()/s);
        if (cssInsert?.index !== undefined) {
            const idx = cssInsert.index + cssInsert[0].length;
            // content = content.slice(0, idx) + `import FLUID_STYLES from "./${name.toLowerCase()}.css";` + content.slice(idx);

            content = content.slice(0, idx) + `import "./${global ? 'globals' : name.toLowerCase()}.css";` + content.slice(idx);
        }

        const filtered = rules.filter(val => !val.global);
        let substyles = content.matchAll(/styles:\s*\{/g), substyle, substyleIndex = 1, substyleOffset = 0;

        while (substyle = substyles.next().value) {
            const i = substyle.index + substyleOffset;

            // doesnt work when not defined using direct object (but variable reference)
            const to = matchBrackets(content, i + substyle[0].length);

            const replacement = `styles:${JSON.stringify(filtered[substyleIndex++]?.selectors || {})}`; // substyleIndex is wrong when using context based components, or multiple subcomponent than don't get passed styles
            content = content.slice(0, i) + replacement + content.slice(to + 1);
            substyleOffset += replacement.length - (to - i);
        }

        fs.writeFileSync(outputPath + `/${global ? 'globals' : name.toLowerCase()}.css`, (global ? rules : filtered).reduce((str, { rules }) => str + rules, '')); // only include styles that get passed in the above segment or are part of the current useStyles call

        content = content.replace(/import\s*(?:[^;,'"]+?\s*from\s*)?(?:"|')[^'"]*stylestore.*?(?:"|');/g, '');
        const useStyles = content.match(/import\s*([^"']+?)\s*from\s*(?:"|')[^'"]*use-styles.*?(?:"|');/);
        if (useStyles?.index) content = content.slice(0, useStyles.index) + content.slice(useStyles.index + useStyles[0].length);
        const match = content.match(new RegExp(`(=|,|;|\\s|:)${useStyles?.[1]}\\(`, 's'));
        // remove useStyles/useGlobalStyles imports

        if (match?.index) {
            // content = content.replace(new RegExp(`${useStyles}\\(.+?\\);`, 's'), 'Object.assign(FLUID_STYLES, styles);');
            // content = content.replace(new RegExp(`${useStyles}\\(.+?\\);`, 's'), `Object.assign(${JSON.stringify(filtered[0]?.selectors || {})}, styles);`);

            const to = matchBrackets(content, match.index as number + match[0].length, '()');
            const stylesVar = content.match(/([^,;\s]+?)\s*\=\s*[^,;\s]+?\.styles/)?.[1];
            content = content.slice(0, match.index + 1) + `Object.assign(${JSON.stringify(filtered[0]?.selectors || {})}, ${stylesVar} || {})` + content.slice(to + 1);
        }

        const useGlobalStyles = content.match(/import\s*([^"']+?)\s*from\s*(?:"|')[^'"]*use-global-styles.*?(?:"|');/);
        if (useGlobalStyles?.index) content = content.slice(0, useGlobalStyles.index) + content.slice(useGlobalStyles.index + useGlobalStyles[0].length);
        let matches = content.matchAll(new RegExp(`(=|,|;|\\s|:)${useGlobalStyles?.[1]}\\(`, 'gs')), globalStyle, globalStyleOffset = 0;

        while (globalStyle = matches.next().value) {
            const i = globalStyle.index + globalStyleOffset;
            let to = matchBrackets(content, i + globalStyle[0].length, '()'), next = content.charAt(to + 1);
            if (next === ';' || next === ',') to++;

            content = content.slice(0, i + 1) + content.slice(to + 1);
            globalStyleOffset -= (to - i);
        }

        FluidStyleStore.rules = {};
    }

    return content;
}