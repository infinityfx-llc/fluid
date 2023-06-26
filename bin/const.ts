import packageJson from '../package.json';

export const OUTPUT_ROOT = './.fluid/';
export const DIST_ROOT = `./node_modules/${packageJson.name}/dist/`;

export const COMPILER_CONFIG = {
    compilerOptions: {
        baseUrl: '.',
        paths: {
            [packageJson.name]: [OUTPUT_ROOT.replace(/\/$/, '')],
            [`${packageJson.name}/*`]: [`${OUTPUT_ROOT}*`]
        }
    },
    exclude: ['node_modules']
}