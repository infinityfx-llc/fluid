import fs from 'fs';
import readline from 'readline';
import { getConfig, getRoots, processFile } from './utils';
import { STYLE_CONTEXT } from '../src/core/style';
import { mergeRecursive } from '../src/core/utils';
import { DEFAULT_THEME } from '../src/core/theme';
import * as COMPONENTS from '../src/index';

export default async function () {

    const { output, dist } = getRoots();

    if (fs.existsSync(output)) {
        fs.rmSync(output, { recursive: true });
    }
    fs.cpSync(dist, output, { recursive: true });
    const size = Object.keys(COMPONENTS).length;

    const config = await getConfig();
    STYLE_CONTEXT.THEME = mergeRecursive(config.theme || {}, DEFAULT_THEME);
    STYLE_CONTEXT.COMPONENTS = config.components || {};

    const components = fs.readFileSync(dist + 'index.js', { encoding: 'ascii' })
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
        const content = fs.readFileSync(dist + file, { encoding: 'ascii' })
            .replace(/(from\s*(?:'|"))\.\/(.*?(?:'|");)/g, '$1../compiled/$2');

        fs.writeFileSync(dist + file, content);
    }

    console.log('\n');
}