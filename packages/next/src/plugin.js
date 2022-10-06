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
                    return Store.hydrated = true;
                }
                if (Store.hydrated && !Store.bundled) {
                    return Store.bundled = true;
                }
            });

            compilation.hooks.additionalAssets.tap(this.name, () => {
                if (!Store.hydrated || Store.bundled) return;

                const scopes = Store.getScopes();
                for (const scope in scopes) {
                    compilation.emitAsset(`./cache/fluid/${scope}.css`, new RawSource(scopes[scope]));
                }
            });
        });
    }

}