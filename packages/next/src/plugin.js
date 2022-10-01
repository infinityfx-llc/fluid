import { is } from '@infinityfx/fluid/utils';
import path from 'path';

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

        if (is.function(webpack)) return webpack(config, options);

        return config;
    };

    return nextConfig;
}