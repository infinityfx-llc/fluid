import fs from 'fs';
import { compileFile, emitCss } from './core';
import { FluidIcon } from '../src/core/icons';
import { getComponentImports, getContext, IOHelper, printProgress, Stats } from './utils';

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

export function createCompiledFolder(io: IOHelper) {
    fs.cpSync(io.root + 'dist/', io.root + 'compiled/', { // sometimes not allowed to copy? (probably because node module loaded in memory)
        recursive: true,
        filter(src) {
            return !/(bin|styles|types)$/.test(src); // add \.map\.js wip!!
        }
    });
}

export async function compileComponents(io: IOHelper, entries: {
    file: string;
    shallow?: boolean;
    inject?: string;
}[], stats: Stats) {
    const context = await getContext();
    context.styles = {}; // dont reset when in manual css output mode

    for (let i = 0; i < entries.length; i++) {
        const { file, shallow, inject } = entries[i];
        const content = io.source(file);

        if (!shallow) {
            let imports = getComponentImports(content),
                entry, j = 0, len = imports.length;

            while (entry = imports.shift()) {
                const { name, path } = entry;

                if (imports.length > 0 && name === inject) {
                    imports.push(entry);
                    continue;
                }

                if (/index.js$/.test(path)) { // maybe check for Root in module (inside compileFile)??
                    const parent = await io.module(path);

                    for (const subName in parent) {
                        await compileFile(io, `${name}.${subName}`, path);
                    }
                } else {
                    await compileFile(io, name, path, name === inject);
                }

                printProgress((stats.index / stats.entries) + (++j / len) / stats.entries); // not fully correct
            }
        }

        io.override(file, content.replace(/(from\s*(?:'|"))\.\/(.*?(?:'|");)/g, '$1../compiled/$2'));
    }

    await emitCss(io, stats, !io.isPrimary);
}