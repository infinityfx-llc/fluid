import { use } from "react";
import { FluidContext } from "../context/fluid";

export default function useFluid() {
    const fluid = use(FluidContext);

    if (!fluid) throw new Error('Unable to access FluidProvider context');

    return fluid;
}