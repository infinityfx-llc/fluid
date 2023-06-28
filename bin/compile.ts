import fs from 'fs';
import { getConfig, insertCompilerConfig, processFile } from './utils';
import { DIST_ROOT, OUTPUT_ROOT } from './const';

export default async function () {

    fs.cpSync(DIST_ROOT, OUTPUT_ROOT, { recursive: true });
    const componentMap = await import('@/src/index');
    const size = Object.keys(componentMap).length;

    const config = await getConfig();

    const entry = fs.readFileSync(DIST_ROOT + 'index.js', { encoding: 'ascii' });
    const components = entry.matchAll(/as\s*(.+?)\s*\}\s*from\s*(?:'|")(.+?)(?:'|");/g);

    console.log();

    let component, i = 0;
    while (component = components.next().value) {
        i++;

        const [_, name, path] = component;
        await processFile('', path, name, componentMap, config.components || {});

        process.stdout.cursorTo(0);
        process.stdout.write(`${(i / size * 100).toFixed(1)}% ` + new Array(Math.round(i / size * 40)).fill('=').join(''));
    }

    insertCompilerConfig();

    console.log('\n');
}