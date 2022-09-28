import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import path from 'path';

const plugins = [
    alias({
        entries: [
            { find: '@components', replacement: path.resolve('src/components') },
            { find: '@hooks', replacement: path.resolve('src/hooks') },
            { find: '@styles', replacement: path.resolve('src/styles') },
            { find: '@core', replacement: path.resolve('src/core') }
        ]
    }),
    resolve(),
    postcss(),
    babel({
        babelHelpers: 'runtime',
        exclude: ['**/node_modules/**'],
        configFile: path.resolve('.babelrc')
    })
];

if (process.env.NODE_ENV === 'production') plugins.push(
    terser(),
    del({
        targets: 'dist/*'
    })
);

export default {
    input: ['src/index.js'],
    external: ['react', 'react-dom', /@babel\/runtime/, /@infinityfx\/lively/],
    output: [
        {
            dir: 'dist/esm',
            format: 'es'
        },
        {
            dir: 'dist/cjs',
            format: 'cjs'
        }
    ],
    plugins
}