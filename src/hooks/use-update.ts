import { useEffect, useRef } from "react";

export default function useUpdate(cb: () => void, dependencies: React.DependencyList) {
    const mounted = useRef(false);

    useEffect(() => {
        let cleanup: any;
        if (mounted.current) cleanup = cb();

        return cleanup;
    }, dependencies);

    useEffect(() => {
        mounted.current = true;
        
        return () => { mounted.current = false; }
    }, []);
}