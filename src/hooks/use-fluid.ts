import { useContext } from "react";
import { FluidContext } from "../context/fluid";

export default function useFluid() {
    const fluid = useContext(FluidContext);

    if (!fluid) throw new Error('Unable to access FluidProvider context');

    return fluid;
}