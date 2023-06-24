import FluidStyleStore from "@/src/core/stylestore";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import fs from 'fs';
import path from 'path';

let fluidConfig = {};

export async function getConfig() {
    try {
        const { default: config } = await import('file://' + process.cwd() + '/fluid.config.js' as any);
        fluidConfig = config;
    } catch (ex) {

    } finally {
        return fluidConfig;
    }
}

export function emitCSS(Component: React.JSXElementConstructor<any>, content: string, outputPath: string) {

    const basePath = outputPath.replace(/[^\/\\]*?$/, '');
    // fs.mkdirSync(basePath, { recursive: true });

    // let importPath, offset = 0;
    // const imports = content.matchAll(/((?:from|import)\s*(?:'|"))(\..+?)(?:'|");/g);
    // while (importPath = imports.next().value) {
    //     const absolutePath = path.join(basePath, importPath[2]);
    //     if (/^(\.fluid\\components|\.fluid\\context)/.test(absolutePath)) continue;

    //     const mappedPath = path.join(basePath.replace('./.fluid', '@infinityfx/fluid/dist'), importPath[2]);
    //     const idx = importPath.index + importPath[1].length + offset;

    //     content = content.slice(0, idx) + mappedPath.replace(/\\/g, '/') + content.slice(idx + importPath[2].length);
    //     offset += mappedPath.length - importPath[2].length;
    // }

    const fnName = content.match(/import\s*([^"']+?)\s*from\s*(?:"|')[^'"]*use-styles.*?(?:"|');/)?.[1];
    const match = content.match(new RegExp(`${fnName}\\(.+?\\);`, 's'));

    if (match?.index) {
        try {
            renderToString(createElement(Component)); // fix fluidprovider context issues
        } catch (ex) { }

        const rule = Object.entries(FluidStyleStore.rules)[0]; // check for multiple entries

        if (rule !== undefined) {
            const [key, store] = rule;
            content = content.slice(0, match.index) + `${JSON.stringify(store.selectors)};` + content.slice(match.index + match[0].length);

            const cssInsert = content.match(/(?:(?:'|")use\sclient(?:'|");)?()/s);
            if (cssInsert?.index !== undefined) {
                const idx = cssInsert.index + cssInsert[0].length;
                content = content.slice(0, idx) + `import './${key}.css';` + content.slice(idx);
            }


            fs.writeFileSync(basePath + `/${key}.css`, store.rules);

            FluidStyleStore.rules = {};
        }
    }

    fs.writeFileSync(outputPath, content);
}