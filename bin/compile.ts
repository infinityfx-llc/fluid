import fs from 'fs';
import { compileStyles, getConfig, getRoots } from './utils';
import { STYLE_CONTEXT } from '../src/core/style';
import { mergeRecursive } from '../src/core/utils';
import { DEFAULT_THEME } from '../src/core/theme';
import packageJson from '../package.json';

export default async function () {

    const { output, dist } = getRoots();

    if (fs.existsSync(output)) {
        fs.rmSync(output, { recursive: true });
    }
    fs.cpSync(dist, output, { recursive: true });

    const config = await getConfig();
    STYLE_CONTEXT.THEME = mergeRecursive(config.theme || {}, DEFAULT_THEME);
    STYLE_CONTEXT.COMPONENTS = config.components || {};

    console.log(`\r\n> ${packageJson.name} v${packageJson.version}\n`);

    await compileStyles();

    for (const file of ['index.js', 'hooks.js']) {
        const content = fs.readFileSync(dist + file, { encoding: 'ascii' })
            .replace(/(from\s*(?:'|"))\.\/(.*?(?:'|");)/g, '$1../compiled/$2');

        fs.writeFileSync(dist + file, content);
    }

    console.log('\n');
}