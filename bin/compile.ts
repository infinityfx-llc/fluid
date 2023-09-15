import fs from 'fs';
import readline from 'readline';
import { getConfig, processFile } from './utils';
import { DIST_ROOT, OUTPUT_ROOT } from './const';
import { STYLE_CONTEXT } from '../src/core/style';
import { mergeRecursive } from '../src/core/utils';
import { DEFAULT_THEME } from '../src/core/theme';
import * as COMPONENTS from '../src/index';

export default async function () {

    if (fs.existsSync(OUTPUT_ROOT)) {
        fs.rmSync(OUTPUT_ROOT, { recursive: true });
    }
    fs.cpSync(DIST_ROOT, OUTPUT_ROOT, { recursive: true });
    const size = Object.keys(COMPONENTS).length;

    const config = await getConfig();
    STYLE_CONTEXT.THEME = mergeRecursive(config.theme || {}, DEFAULT_THEME);
    STYLE_CONTEXT.COMPONENTS = config.components || {};

    const components = fs.readFileSync(DIST_ROOT + 'index.js', { encoding: 'ascii' })
        .matchAll(/as\s*(.+?)\s*\}\s*from\s*(?:'|")(.+?)(?:'|");/g);

    console.log();

    let component, i = 0;
    while (component = components.next().value) {
        i++;

        const [_, name, path] = component;
        await processFile('', path, name, COMPONENTS);

        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${(i / size * 100).toFixed(1)}% ` + new Array(Math.round(i / size * 40)).fill('=').join(''));
    }

    for (const file of ['index.js', 'hooks.js']) {
        const content = fs.readFileSync(DIST_ROOT + file, { encoding: 'ascii' })
            .replace(/(from\s*(?:'|"))\.\/(.*?(?:'|");)/g, '$1../compiled/$2');

        fs.writeFileSync(DIST_ROOT + file, content);
    }

    console.log('\n');
}