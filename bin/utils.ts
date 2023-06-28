import FluidStyleStore from "@/src/core/stylestore";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import fs from 'fs';
import { FluidConfig } from "@/src/types";
import FluidProvider from "@/src/context/fluid";
import { COMPILER_CONFIG, DIST_ROOT, OUTPUT_ROOT } from "./const";
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

export function getCompilerConfig() {
    let config: any = {};
    if (!fs.existsSync('./package.json')) return [config, 'jsconfig.json'];

    const json = JSON.parse(fs.readFileSync('./package.json', { encoding: 'ascii' }));
    const isTS = json.devDependencies?.typescript || json.dependencies?.typescript;
    const file = isTS ? 'tsconfig.json' : 'jsconfig.json';

    if (fs.existsSync(file)) {
        config = JSON.parse(fs.readFileSync(file, { encoding: 'ascii' }));
    }

    return [config, file];
}

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

        while (component = components.next().value) {
            const [_, name, subPath] = component;

            await processFile(path.replace(/[^\/\\]*?$/, ''), subPath, name, Component, styles);
        }
    }

    if (Component instanceof Function || 'render' in Component) {
        fileContent = await emitCSS(name, createElement(Component, { styles, key: 0 }), fileContent, outputPath, global);
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
    FluidStyleStore.modularize = false;
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
        if (cssInsert?.index !== undefined && !global) {
            const idx = cssInsert.index + cssInsert[0].length;
            content = content.slice(0, idx) + `import FLUID_STYLES from "./${name}.module.css";` + content.slice(idx);
        }

        const serialized = (global ? rules : rules.filter(val => !val.global))
            .reduce((str, { rules }) => str + rules, '');

        if (global) {
            const path = config.cssOutput || 'app/globals.css';
            fs.writeFileSync(path, serialized);
        } else {
            fs.writeFileSync(outputPath + `/${name}.module.css`, serialized);
        }

        const useStyles = content.match(/import\s*([^"']+?)\s*from\s*(?:"|')[^'"]*use-styles.*?(?:"|');/)?.[1];
        const store = rules.filter(val => !val.global)[0];

        if (store) {
            // content = content.replace(new RegExp(`${useStyles}\\(.+?\\);`, 's'), `${JSON.stringify(store.selectors)};`);
            content = content.replace(new RegExp(`${useStyles}\\(.+?\\);`, 's'), 'FLUID_STYLES;');
        }

        const useGlobalStyles = content.match(/import\s*([^"']+?)\s*from\s*(?:"|')[^'"]*use-global-styles.*?(?:"|');/)?.[1];
        content = content.replace(new RegExp(`${useGlobalStyles}\\(.+?\\);`, 'gs'), '');

        FluidStyleStore.rules = {};
    }

    return content;
}

export function insertCompilerConfig() {
    const [compilerConfig, compilerFile] = getCompilerConfig();

    const updatedConfig = {
        ...compilerConfig,
        compilerOptions: {
            baseUrl: COMPILER_CONFIG.compilerOptions.baseUrl,
            ...compilerConfig.compilerOptions,
            paths: {
                ...COMPILER_CONFIG.compilerOptions.paths,
                ...compilerConfig.compilerOptions?.paths
            }
        },
        exclude: COMPILER_CONFIG.exclude.concat(compilerConfig.exclude).filter((val, i, arr) => {
            return val !== undefined && arr.indexOf(val) === i;
        })
    };

    fs.writeFileSync(compilerFile, JSON.stringify(updatedConfig, null, '\t'));
}