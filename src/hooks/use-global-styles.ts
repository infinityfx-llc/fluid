import FluidStyleStore from "../core/stylestore";
import { FluidStyles } from "../types";

export default function useGlobalStyles(styles: FluidStyles) {
    const key = FluidStyleStore.hash(styles);
    if (FluidStyleStore.has(key)) return;

    FluidStyleStore.insert(key, styles, true);
}