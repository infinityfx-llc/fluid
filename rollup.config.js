import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import del from 'rollup-plugin-delete';
import typescript from '@rollup/plugin-typescript';
import preserveDirectives from 'rollup-plugin-preserve-directives';
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs';

const plugins = [
    process.env.NODE_ENV === 'production' ? del({
        targets: 'dist/**'
    }) : undefined,
    resolve(),
    commonjs(),
    typescript({
        tsconfig: './tsconfig.json'
    }),
    process.env.NODE_ENV === 'production' ? terser({ compress: { directives: false } }) : undefined,
    preserveShebangs(),
    preserveDirectives()
];

const external = ['react', /react\-dom/, /react\/jsx\-runtime/, /@infinityfx\/lively/, 'tslib', /react\-icons/, 'glob'];
const onwarn = (msg, handler) => {
    if (msg.code === 'THIS_IS_UNDEFINED') return;
    if (msg.code === 'MODULE_LEVEL_DIRECTIVE') return;

    handler(msg);
};

export default [
    {
        input: ['src/index.ts', 'src/hooks.ts', 'bin/cli.ts'],
        external,
        output: {
            dir: 'dist',
            format: 'es',
            sourcemap: true,
            preserveModules: true,
            preserveModulesRoot: 'src'
        },
        plugins,
        onwarn
    },
    {
        input: ['src/utils.ts'],
        external,
        output: [
            {
                file: 'dist/utils.mjs',
                format: 'es',
                sourcemap: true
            },
            {
                file: 'dist/utils.cjs',
                format: 'cjs',
                sourcemap: true
            }
        ],
        plugins: [
            resolve(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json'
            }),
            terser({ compress: { directives: false } }),
        ],
        onwarn
    }
]