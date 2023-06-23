import FluidStyleStore from '@/src/core/stylestore';
import * as test from '@/src/index';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import fs from 'fs';

const output = './.fluid/';
const base = './node_modules/@infinityfx/fluid/dist/';
const size = Object.keys(test).length;

export default function () {

    const entry = fs.readFileSync(base + 'index.js', { encoding: 'ascii' });
    const components = entry.matchAll(/as\s*(.+?)\s*\}\s*from\s*(?:'|")(.+?)(?:'|");/g);

    let component, i = 0, css = '';
    while (component = components.next().value) {
        i++;

        const [_, name, path] = component;
        const Component = test[name as keyof typeof test] as any;
        const rawString = fs.readFileSync(base + path, { encoding: 'ascii' });

        const fnName = rawString.match(/import\s*([^"']+?)\s*from\s*(?:"|')[^'"]*use-styles.*?(?:"|');/)?.[1];
        const match = rawString.match(new RegExp(`${fnName}\\(.+?\\);`, 's'));
        if (!match?.index) continue;

        try {
            renderToString(createElement(Component));
            const store = Object.values(FluidStyleStore.rules)[0];
            const compiled = rawString.slice(0, match.index) + `${JSON.stringify(store.selectors)};` + rawString.slice(match.index + match[0].length);

            css += store.rules;

            FluidStyleStore.rules = {};

            const outputPath = output + path;
            fs.mkdirSync(outputPath.replace(/[^\/\\]*?$/, ''), { recursive: true });
            fs.writeFileSync(outputPath, compiled);

            process.stdout.cursorTo(0);
            process.stdout.write(new Array(Math.round(i / size * 40)).fill('=').join(''));
        } catch (ex) { }
    }

    fs.writeFileSync(output + 'styles.css', css);

    console.log();
    console.log('Completed!');
}