import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import path from 'path';

const plugins = [
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
    input: ['src/index.js', 'src/loaders/compile-style.js', 'src/loaders/style-parser.js'],
    external: ['react', 'react-dom', /next\/head/, /@babel\/runtime/, /@infinityfx\/lively/, /@infinityfx\/fluid/],
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