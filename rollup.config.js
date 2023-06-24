import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import typescript from '@rollup/plugin-typescript';
import preserveDirectives from 'rollup-plugin-preserve-directives';
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs';
import json from '@rollup/plugin-json';

const plugins = [
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    preserveDirectives.default()
];

if (process.env.NODE_ENV === 'production') {
    plugins.splice(3, 0, terser({ compress: { directives: false } }));
    plugins.unshift(del({
        targets: 'dist/**'
    }));
}

const external = ['react', /react-dom/, 'react/jsx-runtime', /@infinityfx\/lively/, 'react-icons']; // add focus-trap and react-icons

export default [
    {
        input: ['src/index.ts', 'src/hooks.ts', 'src/server.ts'],
        external,
        output: {
            dir: 'dist',
            format: 'es',
            sourcemap: true,
            preserveModules: true,
            preserveModulesRoot: 'src'
        },
        plugins,
        onwarn: (msg, handler) => {
            if (msg.code === 'THIS_IS_UNDEFINED') return;
            if (msg.code === 'MODULE_LEVEL_DIRECTIVE') return;

            handler(msg);
        }
    },
    {
        input: ['bin/cli.ts'],
        external,
        output: {
            dir: 'dist',
            format: 'es',
            sourcemap: true
        },
        plugins: [
            resolve(),
            commonjs(),
            json(),
            typescript({ tsconfig: './tsconfig.json' }),
            preserveShebangs(),
            terser()
        ],
        onwarn: (msg, handler) => {
            if (msg.code === 'THIS_IS_UNDEFINED') return;
            if (msg.code === 'MODULE_LEVEL_DIRECTIVE') return;

            handler(msg);
        }
    }
]