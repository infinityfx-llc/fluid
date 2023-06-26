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

    if (/index.js$/.test(path)) {
        let component;
        const components = fileContent.matchAll(/import\s*(.+?)\s*from\s*(?:'|")(.+?)(?:'|");/g);

        while (component = components.next().value) {
            const [_, name, subPath] = component;

            await processFile(path.replace(/[^\/\\]*?$/, ''), subPath, name, Component, styles);
        }
    }

    if (Component instanceof Function || 'render' in Component) {
        fileContent = await emitCSS(createElement(Component, { styles, key: 0 }), fileContent, outputPath);
    }

    fs.writeFileSync(outputPath + filename, fileContent);
}

export async function emitCSS(Component: React.ReactElement, content: string, outputPath: string) {

    const config = await getConfig();

    const fnName = content.match(/import\s*([^"']+?)\s*from\s*(?:"|')[^'"]*use-styles.*?(?:"|');/)?.[1];
    const match = content.match(new RegExp(`${fnName}\\(.+?\\);`, 's'));

    if (match?.index) {
        try {
            const context = createElement(FluidProvider, { theme: config.theme } as any,
                createElement('div', { key: 0 }, Component)
            );

            renderToString(context);
        } catch (ex) { }

        const rule = Object.entries(FluidStyleStore.rules).filter(([_, val]) => !val.global)[0];

        if (rule !== undefined) {
            const [key, store] = rule;
            content = content.slice(0, match.index) + `${JSON.stringify(store.selectors)};` + content.slice(match.index + match[0].length);

            const cssInsert = content.match(/(?:(?:'|")use\sclient(?:'|");\n?)?()/s);
            if (cssInsert?.index !== undefined) {
                const idx = cssInsert.index + cssInsert[0].length;
                content = content.slice(0, idx) + `import"./${key}.css";` + content.slice(idx);
            }


            fs.writeFileSync(outputPath + `/${key}.css`, store.rules);

            FluidStyleStore.rules = {};
        }
    }

    return content;
}

export async function compileTheme() { // TEMP SOLUTION
    const config = await getConfig();

    let fileContent = fs.readFileSync(DIST_ROOT + 'core/theme.js', { encoding: 'ascii' });
    const varName = fileContent.match(/(?:([^,{]+?)\s*as\s*)?DEFAULT_THEME/s)?.[1] || 'DEFAULT_THEME';
    const match = fileContent.match(new RegExp(`(${varName}\\s*=\\s*)(\\{[^;]+\\});`, 's'));

    if (!match?.index) return;

    const merged = mergeRecursive(config.theme, DEFAULT_THEME);

    fileContent = fileContent.slice(0, match.index + match[1].length) + `${JSON.stringify(merged)};` + fileContent.slice(match.index + match[0].length);

    fs.writeFileSync(OUTPUT_ROOT + 'core/theme.js', fileContent);
}