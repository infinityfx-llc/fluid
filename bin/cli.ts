#! /usr/bin/env node

import { compile, fallback, help } from './commands.js';

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'compile':
        compile(args[1] || '');
        break;
    case 'help':
        help();
        break;
    default:
        fallback(command);
}