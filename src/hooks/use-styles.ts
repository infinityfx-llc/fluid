import FluidStyleStore from "../core/stylestore";

type FluidStyles = {
    [key: string]: React.CSSProperties
};

export default function useStyles(styles: FluidStyles, fallback: FluidStyles = {}) {
    const key = FluidStyleStore.hash(styles, fallback);
    const selectors = FluidStyleStore.get(key);

    if (selectors) return selectors;

    const merged = FluidStyleStore.merge(styles, fallback);
    return FluidStyleStore.insert(key, merged);
}