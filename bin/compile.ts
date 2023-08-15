import fs from 'fs';
import readline from 'readline';
import { getConfig, processFile } from './utils';
import { DIST_ROOT, OUTPUT_ROOT } from './const';

export default async function () {

    if (fs.existsSync(OUTPUT_ROOT)) {
        fs.rmSync(OUTPUT_ROOT, { recursive: true });
    }
    fs.cpSync(DIST_ROOT, OUTPUT_ROOT, { recursive: true });
    const componentMap = await import('../src/index');
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

        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${(i / size * 100).toFixed(1)}% ` + new Array(Math.round(i / size * 40)).fill('=').join(''));
    }
    
    fs.writeFileSync(DIST_ROOT + 'index.js', entry.replace(/(from\s*(?:'|"))\.\/(.*?(?:'|");)/g, '$1../compiled/$2')); // WIP
    // insertCompilerConfig();

    console.log('\n');
}