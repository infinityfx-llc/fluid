import { compileComponents, compileIcons, compileTypes, sanitizeImports } from "./compile";
import { getContext, getIOHelper } from "./utils";

const external = [
    {
        name: '@infinityfx/splash',
        entries: [
            { file: 'index.js', inject: 'Splash' }
        ]
    },
    {
        name: '@infinityfx/rte',
        entries: [
            { file: 'index.js', inject: 'TextEditor' }
        ]
    }
];

export async function compile(flag: string) {
    const { isInternal, name, version } = await getContext(/^-{1,2}d(ev)?/.test(flag));
    const packages = [{
        name: '@infinityfx/fluid',
        entries: [
            { file: 'index.js', inject: 'FluidProvider' },
            { file: 'hooks.js', shallow: true }
        ]
    }];
    if (!isInternal) packages.unshift(...external);

    console.log(`\r\n> ${name} v${version}\n`);

    for (let i = 0; i < packages.length; i++) {
        const { name, entries } = packages[i];

        const io = await getIOHelper(`node_modules/${name}/`);
        if (!io) continue;

        sanitizeImports(io, entries);
        await compileComponents(io, entries, i, packages.length);

        if (name === '@infinityfx/fluid') {
            await compileIcons(io);
            await compileTypes(io);
        }
    }

    console.log('\n');
}

export function help() {
    console.log();
    console.log('Commands:');
    console.log();
    console.log('compile                compile fluid components using the current theme');
    console.log();
}

export async function fallback(command: any) {
    const { name, version } = await getContext();

    if (command) {
        console.log(`'${command}' is not recognized as a fluid command.`);
        console.log();
        console.log(`Run 'fluid help' for a list of commands.`);
    } else {
        console.log();
        console.log(`${name} v${version}`);
        console.log();
        console.log('Usage: fluid <command>');
        console.log();
        console.log(`Run 'fluid help' for a list of commands.`);
        console.log();
    }
}