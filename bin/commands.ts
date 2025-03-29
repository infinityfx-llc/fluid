import { compileComponents, compileIcons, compileTypes, createCompiledFolder } from "./compile";
import { emptyStats, getContext, getIOHelper, printStats } from "./utils";

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

    const stats = emptyStats(packages.length);

    for (stats.index = 0; stats.index < packages.length; stats.index++) {
        const { name, entries } = packages[stats.index];

        const io = await getIOHelper(`node_modules/${name}/`);
        if (!io) continue;

        createCompiledFolder(io);
        await compileComponents(io, entries, stats);

        if (name === '@infinityfx/fluid') {
            await compileIcons(io);
            await compileTypes(io);
        }
    }

    printStats(stats);
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