import FluidStyleStore from "../core/stylestore";
import ClientFluidStyles from "./test";

export default function FluidStyles() {

    // @ts-expect-error
    return <><style precedence="fluid__server" href="fluid__server__styles" dangerouslySetInnerHTML={{ __html: FluidStyleStore.serialize() }} /><ClientFluidStyles /></>;
}