import FluidStyleStore from "../core/stylestore";

type FluidStyles = {
    [key: string]: React.CSSProperties
};

export default function useGlobalStyles(styles: FluidStyles) {
    const key = FluidStyleStore.hash(styles);
    if (FluidStyleStore.has(key)) return;

    FluidStyleStore.insert(key, styles, true);
}