import { useRef, useEffect } from 'react';

export default function useClickOutside(cb: () => void, dependencies: React.DependencyList = []) {
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
        function click(e: MouseEvent) {
            if (ref.current?.contains(e.target as HTMLElement)) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                cb();
            }
        }

        window.addEventListener('click', click);

        return () => window.removeEventListener('click', click);
    }, dependencies);

    return ref;
}