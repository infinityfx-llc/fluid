import fs from 'fs';
import { unlink } from 'fs/promises';
import { compileFile, emitCss } from './core';
import { FluidIcon } from '../src/core/icons';
import { getContext, IOHelper, printProgress, Stats } from './utils';
import { glob } from 'glob';

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

export async function purge(io: IOHelper, entries: {
    file: string;
}[]) {
    for (const { file } of entries) {
        const content = io.source(file).replace(/\.\/compiled/g, '');
        io.override(file, content);
    }

    const files = await glob(io.root + 'compiled/*.css');
    await Promise.all(files.map(unlink));

    fs.cpSync(io.root + 'dist/', io.root + 'compiled/', {
        recursive: true,
        filter(src) {
            return !/((bin|styles|types)$|\.map$)/.test(src);
        }
    });
}

export async function compileComponents(io: IOHelper, entries: {
    file: string;
    shallow?: boolean;
    inject?: string;
}[], stats: Stats) {
    const context = await getContext();
    context.styles = {};

    for (const { file, shallow, inject } of entries) {
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

                if (/index.js$/.test(path)) { // maybe check for Root in module (inside compileFile)??
                    const parent = await io.module(path);

                    for (const subName in parent) {
                        await compileFile(io, `${name}.${subName}`, path.replace(/index\.js$/, `${subName.toLowerCase()}.js`));
                    }
                } else {
                    await compileFile(io, name, path, name === inject);
                }

                printProgress((stats.index / stats.entries) + (++j / len) / stats.entries); // not fully correct
            }
        }

        io.override(file, content.replace(/(from\s*(?:'|"))\.\/(.*?(?:'|");)/g, '$1../compiled/$2'));
    }

    await emitCss(io, stats, io.parent !== 'fluid');
}