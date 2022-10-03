import { is } from '@infinityfx/fluid/utils';
import path from 'path';
import CompileFluidPlugin from './plugin';

export default function withFluid(nextConfig = {}) {

    const webpack = nextConfig.webpack;

    nextConfig.webpack = (config, options) => {
        config.module.rules.unshift({
            test: /\.js$/,
            use: [
                path.resolve(__dirname, './compile-style.js'),
                path.resolve(__dirname, './style-parser.js')
            ]
        });

        const oneOf = config.module.rules.find(val => val.oneOf)?.oneOf;
        if (oneOf) {
            for (let i = oneOf.length - 1; i >= 0; i--) { // replace later on with more specific solution to FLUID
                if (oneOf[i].use?.loader === 'error-loader' && oneOf[i].test?.toString().includes('.css')) {
                    oneOf.splice(i, 1);
                }

                const issuer = oneOf[i].issuer?.and?.[0].toString();
                if (/_app\/$/.test(issuer)) delete oneOf[i].issuer;
            }
        }

        config.plugins.push(new CompileFluidPlugin());

        if (is.function(webpack)) return webpack(config, options);

        return config;
    };

    return nextConfig;
}