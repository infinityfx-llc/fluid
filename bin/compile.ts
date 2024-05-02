import { compileImports, compileStyles, getConfig, sanitizeImports } from './utils';
import { STYLE_CONTEXT } from '../src/core/style';
import { mergeRecursive } from '../src/core/utils';
import { DEFAULT_THEME } from '../src/core/theme';
import packageJson from '../package.json';

export default async function () {

    sanitizeImports();

    const config = await getConfig();
    STYLE_CONTEXT.THEME = mergeRecursive(config.theme || {}, DEFAULT_THEME);
    STYLE_CONTEXT.COMPONENTS = config.components || {};

    console.log(`\r\n> ${packageJson.name} v${packageJson.version}\n`);

    await compileStyles();

    compileImports();

    console.log('\n');
}