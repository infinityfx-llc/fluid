import FluidStyleStore from "../core/stylestore";
import { FluidStyles, Selectors } from "../types";

export default function useStyles<T extends string = any>(styles: FluidStyles, fallback: FluidStyles = {}) {
    const key = FluidStyleStore.hash(styles, fallback);
    const selectors = FluidStyleStore.get(key);

    if (selectors) return selectors as Selectors<T>;

    const merged = FluidStyleStore.merge(styles, fallback);
    return FluidStyleStore.insert(key, merged) as Selectors<T>;
}