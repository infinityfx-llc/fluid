import fs from 'fs';
import packageJson from '../package.json';
import { emitCSS, getConfig } from './utils';

const output = './.fluid/';
const base = `./node_modules/${packageJson.name}/dist/`;

export default async function () {

    fs.cpSync(base, output, { recursive: true });
    const componentMap = await import('@/src/index');
    const size = Object.keys(componentMap).length;

    const config = await getConfig();

    const entry = fs.readFileSync(base + 'index.js', { encoding: 'ascii' });
    const components = entry.matchAll(/as\s*(.+?)\s*\}\s*from\s*(?:'|")(.+?)(?:'|");/g);

    console.log();

    let component, i = 0;
    while (component = components.next().value) {
        i++;

        const [_, name, path] = component;
        const Component = componentMap[name as keyof typeof componentMap] as any;
        const rawString = fs.readFileSync(base + path, { encoding: 'ascii' });

        if (/index.js$/.test(path)) {
            let subComponent;
            const subComponents = rawString.matchAll(/import\s*(.+?)\s*from\s*(?:'|")(.+?)(?:'|");/g);

            while (subComponent = subComponents.next().value) {
                const [_, name, subPath] = subComponent;

                const importPath = (base + path).replace(/[^\/\\]*?$/, '') + subPath;
                const rawString = fs.readFileSync(importPath, { encoding: 'ascii' });

                emitCSS(Component[name], rawString, output + path.replace(/[^\/\\]*?$/, '') + subPath);
            }
        }

        emitCSS(Component, rawString, output + path);

        process.stdout.cursorTo(0);
        process.stdout.write(new Array(Math.round(i / size * 40)).fill('=').join(''));
    }

    // fs.writeFileSync(output + 'index.js', entry);

    console.log('\n');
    console.log('Compiled!');
}