import { useContext, useRef } from "react";
import { InitialLayoutdata, LayoutContext, LayoutData } from "../context/layout";
import useDomEffect from "./use-dom-effect";

export default function useLayout(data: Partial<LayoutData>) {
    const layout = useContext(LayoutContext);
    const cache = useRef('');

    useDomEffect(() => {
        const serialized = JSON.stringify(data);
        if (cache.current === serialized) return;

        layout?.mutate(data);
        cache.current = serialized;
    }, [data]);

    return layout || InitialLayoutdata;
}