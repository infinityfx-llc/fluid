import fs from 'fs';
import { getConfig, getRoots, processFile } from './utils';
import { STYLE_CONTEXT } from '../src/core/style';
import { mergeRecursive } from '../src/core/utils';
import packageJson from '../package.json';
import readline from 'readline';

export default async function () {

    sanitizeImports();

    const config = await getConfig();
    STYLE_CONTEXT.THEME = mergeRecursive(config.theme || {}, STYLE_CONTEXT.THEME);
    STYLE_CONTEXT.COMPONENTS = config.components || {};
    STYLE_CONTEXT.PATHS = config.paths || STYLE_CONTEXT.PATHS;

    console.log(`\r\n> ${packageJson.name} v${packageJson.version}\n`);

    await compileStyles();

    compileImports();

    console.log('\n');
}

function sanitizeImports() {
    const { dist, output } = getRoots();

    for (const file of ['index.js', 'hooks.js']) {
        const content = fs.readFileSync(dist + file, { encoding: 'ascii' })
            .replace(/\.\/compiled/g, '');

        fs.writeFileSync(dist + file, content);
    }

    if (fs.existsSync(output)) fs.rmSync(output, { recursive: true });
    fs.cpSync(dist, output, { recursive: true });
}

function compileImports() {
    const { dist } = getRoots();

    for (const file of ['index.js', 'hooks.js']) {
        const content = fs.readFileSync(dist + file, { encoding: 'ascii' })
            .replace(/(from\s*(?:'|"))\.\/(.*?(?:'|");)/g, '$1../compiled/$2');

        fs.writeFileSync(dist + file, content);
    }
}

async function compileStyles() {
    const { dist } = getRoots();
    const COMPONENTS = await import('../src/index');

    const imports = Array.from(fs.readFileSync(dist + 'index.js', { encoding: 'ascii' })
        .matchAll(/as\s*(.+?)\s*\}\s*from\s*(?:'|")(.+?)(?:'|");/g));

    for (let i = 0; i < imports.length; i++) {

        const [_, name, path] = imports[i];

        if (/index.js$/.test(path)) {
            const Component = (COMPONENTS as any)[name.replace(/.*\./, '')];

            for (const subName in Component) {
                const localPath = path.replace(/index\.js/, `${subName.toLowerCase()}.js`);

                await processFile(`${name}.${subName}`, localPath, COMPONENTS, Component);
            }
        } else
            if (!/context\/fluid\.js$/.test(path)) {
                await processFile(name, path, COMPONENTS);
            }

        const total = imports.length - 1;
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${(i / total * 100).toFixed(1)}% ` + new Array(Math.round(i / total * 40)).fill('=').join(''));
    }

    await processFile('FluidProvider', './context/fluid.js', COMPONENTS);
}