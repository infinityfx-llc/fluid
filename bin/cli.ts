#! /usr/bin/env node

import compile from "./compile.js";
import packageJson from '../package.json';

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'compile':
        compile(args[1] || '');
        break;
    case 'help':
        console.log();
        console.log('Commands:');
        console.log();
        console.log('compile                compile fluid components using the current theme');
        console.log();
        break;
    default:
        if (command) {
            console.log(`'${command}' is not recognized as a fluid command.`);
            console.log();
            console.log(`Run 'fluid help' for a list of commands.`);
        } else {
            console.log();
            console.log(`${packageJson.name} v${packageJson.version}`);
            console.log();
            console.log('Usage: fluid <command>');
            console.log();
            console.log(`Run 'fluid help' for a list of commands.`);
            console.log();
        }
}