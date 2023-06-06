import { useContext, useMemo, useLayoutEffect, useEffect, useRef } from "react";
import { InitialLayoutdata, LayoutContext, LayoutData } from "../context/layout";

export default function useLayout(data: Partial<LayoutData>) {
    const layout = useContext(LayoutContext);
    const cache = useRef('');

    useLayoutEffect(() => {
        const serialized = JSON.stringify(data);
        if (cache.current === serialized) return;

        layout?.mutate(data);
        cache.current = serialized;
    }, [data]);

    return layout || InitialLayoutdata;
}