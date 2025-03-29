import fs from 'fs';
import readline from 'readline';
import { glob } from "glob";
import { mergeRecursive } from '../src/core/utils';
import { GLOBAL_CONTEXT } from '../src/core/shared';

export function printProgress(progress: number) {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${(progress * 100).toFixed(1)}% ` + new Array(Math.round(progress * 40)).fill('=').join(''));
}

export type Stats = {
    index: number;
    entries: number;
    start: number;
    compiled: number;
    files: {
        name: string;
        size: number;
    }[];
}

export const emptyStats = (entries: number): Stats => ({
    index: 0,
    entries,
    start: performance.now(),
    compiled: 0,
    files: []
});

export function printStats(stats: Stats) {
    console.log('\n');
    console.log(`Compiled \x1b[1m${stats.compiled}\x1b[0m components in \x1b[1m${((performance.now() - stats.start) / 1000).toFixed(2)}\x1b[0m sec.`);
    console.log();
    console.log('\x1b[4mFile\x1b[0m                   \x1b[4mSize\x1b[0m');
    stats.files.forEach(({ name, size }) => console.log(`${name.padEnd(23, ' ')}${(size / 1024).toFixed(1)}kb`));
    console.log('');
}

export function matchBrackets(content: string, start: number, type: '{}' | '()' | '[]' = '{}') {
    let count = 1;

    while (count > 0) {
        if (content.charAt(start) == type.charAt(0)) count++;
        if (content.charAt(start) == type.charAt(1)) count--;
        if (count > 0) start++;
    }

    return start;
}

export function replace(content: string, from: number, to: number, by: string) {
    return content.slice(0, from) + by + content.slice(to);
}

export function stripImports(content: string) {
    ['core(\\/|\\\\)style\\.js', '(\\/|\\\\)fluid(\\/|\\\\)css', 'styles(\\/|\\\\).+?']
        .map(val => new RegExp(`import[^;]*?${val}("|');?`, 'g'))
        .forEach(pattern => content = content.replace(pattern, ''));

    return content;
}

export const keyFromImport = (str: string) => str
    .replace(/^\s+|\s+(as\s+.+)?$/g, '')
    .replace(/\.\w+$/, '')
    .replace(/([a-z])([A-Z])/, '$1-$2')
    .toLowerCase();

export function getComponentImports(content: string) {
    return Array.from(content.matchAll(/as\s*(.+?)\s*\}\s*from\s*(?:'|")(.+?)(?:'|");/g))
        .map(([_, name, path]) => ({
            name,
            path: path.replace(/\.\/compiled/g, '')
        }));
}

let config: any;

export async function getContext(isDev?: boolean): Promise<typeof GLOBAL_CONTEXT> {
    if (!config) {
        const [configFile] = await glob('./fluid.config.{js,mjs}');

        try {
            config = (await import(`file://${process.cwd()}/${configFile}?nonce=${Math.random()}`)).default;
            const rawConfig = fs.readFileSync(process.cwd() + `/${configFile}`, { encoding: 'ascii' });

            GLOBAL_CONTEXT.theme = mergeRecursive(config.theme, GLOBAL_CONTEXT.theme);
            GLOBAL_CONTEXT.components = config.components || {};
            GLOBAL_CONTEXT.paths = config.paths || GLOBAL_CONTEXT.paths;
            GLOBAL_CONTEXT.cssOutput = config.cssOutput || GLOBAL_CONTEXT.cssOutput;
            GLOBAL_CONTEXT.icons = config.icons || {};
            GLOBAL_CONTEXT.rawConfig = rawConfig;

            const files = await glob(['./node_modules/@infinityfx/fluid/package.json', './package.json']);
            const file = files.length > 1 ?
                files.find(file => file.startsWith('node_modules')) as string :
                files[0];
            const { name, version } = JSON.parse(fs.readFileSync(file, { encoding: 'ascii' }));

            GLOBAL_CONTEXT.name = name;
            GLOBAL_CONTEXT.version = version;
            GLOBAL_CONTEXT.isInternal = files.length < 2;
        } catch { }
    }

    if (isDev !== undefined) GLOBAL_CONTEXT.isDev = isDev;

    return GLOBAL_CONTEXT;
}

export type IOHelper = {
    root: string;
    isPrimary: boolean;
    module(file: string): Promise<React.FunctionComponent<any>>;
    source(file: string): string;
    output(file: string, content: string): void;
    override(file: string, content: string): void;
}

export async function getIOHelper(base: string): Promise<IOHelper | null> {
    const { isInternal } = await getContext();
    const isPrimary = /@infinityfx\/fluid\/$/.test(base),
        root = isInternal && isPrimary ? './' : base;

    if (!fs.existsSync(root)) return null;

    return {
        root,
        isPrimary,
        async module(file: string) {
            return (await import(`file://${process.cwd()}/${root}dist/${file}?nonce=${Math.random()}`)).default;
        },
        source(file: string) {
            return fs.readFileSync(root + 'dist/' + file, { encoding: 'ascii' });
        },
        output(file: string, content: string) {
            fs.writeFileSync(root + 'compiled/' + file, content);
        },
        override(file: string, content: string) {
            fs.writeFileSync(root + 'dist/' + file, content);
        }
    }
}