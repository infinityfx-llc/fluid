import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import typescript from '@rollup/plugin-typescript';
import banner2 from 'rollup-plugin-banner2';

const plugins = [
    resolve(),
    typescript({ tsconfig: './tsconfig.json' }),
    banner2(() => "'use client';")
];

if (process.env.NODE_ENV === 'production') {
    plugins.splice(2, 0, terser());
    plugins.unshift(del({
        targets: 'dist/**'
    }));
}

export default {
    input: ['src/index.ts', 'src/server.ts'],
    external: ['react', 'react-dom', 'react/jsx-runtime', /@infinityfx\/lively/],
    output: {
        dir: 'dist',
        format: 'es',
        sourcemap: true
    },
    plugins
}