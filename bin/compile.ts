import fs from 'fs';
import { compileFile, emitCss } from './core';
import { FluidIcon } from '../src/core/icons';
import { getContext, IOHelper, printProgress } from './utils';

export async function compileTypes(io: IOHelper) {
    const { theme } = await getContext();

    let palettes = Array.from(new Set([...Object.keys(theme.palettes), 'light', 'dark', 'system']).keys()),
        types = io.source('./types/src/types.d.ts');

    types = types.replace(/(FluidColorScheme\s*=\s*).+?(;)/, `$1${palettes.map(name => `'${name}'`).join(' | ')}$2`);

    io.override('./types/src/types.d.ts', types);
}

export async function compileIcons(io: IOHelper) {
    const { icons, rawConfig } = await getContext();

    let contents = io.source('./core/icons.js');

    for (const icon in icons) {
        contents = contents.replace(new RegExp(`${icon}:\\w+(,|\\})`), `${icon}:${(icons[icon as FluidIcon] as any).name}$1`);
    }

    const imports = Array.from(rawConfig.matchAll(/import\s*(.+?)from\s*(?:"|')([^"']+)(?:"|')/g))
        .concat(Array.from(rawConfig.matchAll(/(?:const|let|var)\s*(.+?)\s*=\s*require\((?:'|")([^"']+)(?:"|')/g)));

    contents = imports.map(([_, value, path]) => `import ${value.replace(/:/g, ' as ')} from "${path}";`).join('') + contents; // replace local paths

    io.output('./core/icons.js', contents);
}

export function sanitizeImports(io: IOHelper, entries: {
    file: string;
    shallow?: boolean;
}[]) {
    for (const { file } of entries) {
        const content = io.source(file).replace(/\.\/compiled/g, ''); // doesnt remove compiled paths sometimes??

        io.override(file, content);
    }

    if (fs.existsSync(io.root + 'compiled/')) fs.rmSync(io.root + 'compiled/', { recursive: true }); // sometimes throws no empty error..??
    fs.cpSync(io.root + 'dist/', io.root + 'compiled/', { recursive: true });
}

export async function compileComponents(io: IOHelper, entries: {
    file: string;
    shallow?: boolean;
    inject?: string;
}[], index: number, total: number) {
    const context = await getContext();
    context.styles = {}; // dont reset when in manual css output mode

    for (let i = 0; i < entries.length; i++) {
        const { file, shallow, inject } = entries[i];
        const content = io.source(file);

        if (!shallow) {
            let imports = Array.from(content.matchAll(/as\s*(.+?)\s*\}\s*from\s*(?:'|")(.+?)(?:'|");/g)),
                entry, j = 0, len = imports.length;

            while (entry = imports.shift()) {
                const [_, name, path] = entry;

                if (imports.length > 0 && name === inject) {
                    imports.push(entry);
                    continue;
                }

                if (/index.js$/.test(path)) {
                    const parent = await io.module(path);

                    for (const subName in parent) {
                        await compileFile(io, `${name}.${subName}`, path);
                    }
                } else {
                    await compileFile(io, name, path, name === inject);
                }

                printProgress((index / total) + (++j / len) / total); // not fully correct
            }
        }

        io.override(file, content.replace(/(from\s*(?:'|"))\.\/(.*?(?:'|");)/g, '$1../compiled/$2'));
    }

    await emitCss(io);
}