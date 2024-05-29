'use client';

import { useRef, useEffect } from 'react';

// NOT USED INTERNALLY
export default function useClickOutside<T extends HTMLElement>(cb: (e: MouseEvent) => void, dependencies: React.DependencyList = []) {
    const ref = useRef<T>(null);

    useEffect(() => {
        function click(e: MouseEvent) {
            if (ref.current?.contains(e.target as T)) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                cb(e);
            }
        }

        window.addEventListener('click', click);

        return () => window.removeEventListener('click', click);
    }, dependencies);

    return ref;
}