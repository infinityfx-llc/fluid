import FluidStyleStore from "../core/stylestore";
import ClientFluidStyles from "./client-styles";

export default function FluidStyles() {

    // @ts-expect-error
    return <><style precedence="fluid__static" href="fluid__static" dangerouslySetInnerHTML={{ __html: FluidStyleStore.serialize() }} /><ClientFluidStyles /></>;
}