import FluidStyleStore from "../core/stylestore"

export default function FluidStyles() {

    // @ts-expect-error
    return <style precedence="default" href="fluid__styles" dangerouslySetInnerHTML={{ __html: FluidStyleStore.serialize() }} />;
}