import fs from 'fs';
import { getCompilerConfig, getConfig, processFile } from './utils';
import { COMPILER_CONFIG, DIST_ROOT, OUTPUT_ROOT } from './const';

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

    const [compilerConfig, compilerFile] = getCompilerConfig();
    const updatedConfig = {
        ...compilerConfig,
        compilerOptions: {
            baseUrl: COMPILER_CONFIG.compilerOptions.baseUrl,
            ...compilerConfig.compilerOptions,
            paths: {
                ...COMPILER_CONFIG.compilerOptions.paths,
                ...compilerConfig.compilderOptions?.paths
            }
        },
        exclude: COMPILER_CONFIG.exclude.concat(compilerConfig.exclude).filter((val, i, arr) => {
            return val !== undefined && arr.indexOf(val) === i;
        })
    }

    fs.writeFileSync(compilerFile, JSON.stringify(updatedConfig, null, '\t'));

    console.log('\n');
}