import FluidStyleStore from "@/src/core/stylestore";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import fs from 'fs';
import { FluidConfig } from "@/src/types";
import FluidProvider from "@/src/context/fluid";
import { DIST_ROOT, OUTPUT_ROOT } from "./const";
import { mergeRecursive } from "@/src/core/utils";
import { DEFAULT_THEME } from "@/src/core/theme";

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

// export function getCompilerConfig() {
//     let config: any = {};
//     if (!fs.existsSync('./package.json')) return [config, 'jsconfig.json'];

//     const json = JSON.parse(fs.readFileSync('./package.json', { encoding: 'ascii' }));
//     const isTS = json.devDependencies?.typescript || json.dependencies?.typescript;
//     const file = isTS ? 'tsconfig.json' : 'jsconfig.json';

//     if (fs.existsSync(file)) {
//         config = JSON.parse(fs.readFileSync(file, { encoding: 'ascii' }));
//     }

//     return [config, file];
// }

export async function processFile(root: string, path: string, name: string, componentMap: any, stylesMap: any) {
    let fileContent = fs.readFileSync(DIST_ROOT + root + path, { encoding: 'ascii' });
    const [outputPath, filename] = (OUTPUT_ROOT + root + path).split(/([^\/\\]*?$)/);
    const Component = componentMap[name];

    let styles: any = {};
    if (name in stylesMap) styles = stylesMap[name];

    let global = false;
    if (/context\/fluid.js$/.test(path)) {
        fileContent = await insertTheme(fileContent);
        global = true;
    }

    if (/index.js$/.test(path)) {
        let component;
        const components = fileContent.matchAll(/import\s*(.+?)\s*from\s*(?:'|")(.+?)(?:'|");/g);
        // fileContent = fileContent.replace(/(from".*?)([^\/\\]*?";)/g, '$1__$2');

        while (component = components.next().value) {
            const [_, name, subPath] = component;

            await processFile(path.replace(/[^\/\\]*?$/, ''), subPath, name, Component, styles);
        }
    }

    if (Component instanceof Function || 'render' in Component) {
        fileContent = await emitCSS(name, createElement(Component, { styles, key: 0, steps: [], options: [], data: [], columns: [], include: [], name: '' }, ''), fileContent, outputPath, global);
        // extra props to render correctly
        // TODO: also fix missing context errors for Popover, Accordion
    }

    fs.writeFileSync(outputPath + filename, fileContent);
}

async function insertTheme(content: string) {
    const config = await getConfig();

    const mergeRecursiveImport = content.match(/import\s*\{[^{]*(mergeRecursive(?:\s*as\s*([^\s}]+))?)[^}]*\}/);
    const fnName = mergeRecursiveImport?.[2] || 'mergeRecursive';
    const match = content.match(new RegExp(`${fnName}\\(.+?\\);`, 's'));

    if (match?.index) {
        const merged = mergeRecursive(config.theme, DEFAULT_THEME);

        content = content.slice(0, match.index) + JSON.stringify(merged) + content.slice(match.index + match[0].length);
    }

    return content;
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
            let i = substyle.index + substyleOffset,
                bracketIndex = i + substyle[0].length,
                count = 1;

            while (count > 0) { // doesnt work when not defined using direct object (but variable reference)
                if (content.charAt(bracketIndex) === '{') count++;
                if (content.charAt(bracketIndex) === '}') count--;
                bracketIndex++;
            }

            const replacement = `styles:${JSON.stringify(filtered[substyleIndex++]?.selectors || {})}`;
            content = content.slice(0, i) + replacement + content.slice(bracketIndex);
            substyleOffset += replacement.length - (bracketIndex - i);
        }

        // if (global) {
        // const path = config.cssOutput || 'app/fluid.css';
        // fs.writeFileSync(path, rules.reduce((str, { rules }) => str + rules, ''));
        // } else {
        fs.writeFileSync(outputPath + `/${global ? 'globals' : name.toLowerCase()}.css`, (global ? rules : filtered).reduce((str, { rules }) => str + rules, ''));
        // }

        const useStyles = content.match(/import\s*([^"']+?)\s*from\s*(?:"|')[^'"]*use-styles.*?(?:"|');/)?.[1];

        if (useStyles) {
            // content = content.replace(new RegExp(`${useStyles}\\(.+?\\);`, 's'), 'Object.assign(FLUID_STYLES, styles);');
            content = content.replace(new RegExp(`${useStyles}\\(.+?\\);`, 's'), `Object.assign(${JSON.stringify(filtered[0]?.selectors || {})}, styles);`);
        }

        const useGlobalStyles = content.match(/import\s*([^"']+?)\s*from\s*(?:"|')[^'"]*use-global-styles.*?(?:"|');/)?.[1];
        if (useGlobalStyles) {
            content = content.replace(new RegExp(`${useGlobalStyles}\\(.+?\\);`, 'gs'), '');
        }

        FluidStyleStore.rules = {};
    }

    return content;
}

// export function insertCompilerConfig() {
//     const [compilerConfig, compilerFile] = getCompilerConfig();

//     const updatedConfig = {
//         ...compilerConfig,
//         compilerOptions: {
//             baseUrl: COMPILER_CONFIG.compilerOptions.baseUrl,
//             ...compilerConfig.compilerOptions,
//             paths: {
//                 ...COMPILER_CONFIG.compilerOptions.paths,
//                 ...compilerConfig.compilerOptions?.paths
//             }
//         },
//         exclude: COMPILER_CONFIG.exclude.concat(compilerConfig.exclude).filter((val, i, arr) => {
//             return val !== undefined && arr.indexOf(val) === i;
//         })
//     };

//     fs.writeFileSync(compilerFile, JSON.stringify(updatedConfig, null, '\t'));
// }