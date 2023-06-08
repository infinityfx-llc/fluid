import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import typescript from '@rollup/plugin-typescript';
import preserveDirectives from 'rollup-plugin-preserve-directives';

const plugins = [
    resolve(),
    typescript({ tsconfig: './tsconfig.json' }),
    preserveDirectives.default()
];

if (process.env.NODE_ENV === 'production') {
    plugins.splice(2, 0, terser({ compress: { directives: false } }));
    plugins.unshift(del({
        targets: 'dist/**'
    }));
}

export default {
    input: ['src/index.ts', 'src/server.ts'],
    external: ['react', 'react-dom', 'react/jsx-runtime', /@infinityfx\/lively/, 'react-icons'],
    output: {
        dir: 'dist',
        format: 'es',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src'
    },
    plugins
}