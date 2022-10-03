import Store from './store';

export default class CompileFluidPlugin {

    constructor() {
        this.name = CompileFluidPlugin.name;
        this.options = {};
    }

    apply(compiler) {
        const { webpack } = compiler;
        const RawSource = webpack.sources.RawSource;

        compiler.hooks.thisCompilation.tap(this.name, (compilation) => {

            compilation.hooks.needAdditionalPass.tap(this.name, () => {
                if (!Store.hydrated) {
                    const files = Store.getCssFiles();
                    for (const name in files) {
                        compilation.emitAsset(`./cache/fluid/${name}.css`, new RawSource(files[name]));
                    }

                    return Store.hydrated = true;
                }
            });
        });
    }

}