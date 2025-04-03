import { useRef } from "react";

export default function useDebounce<T extends (...args: any) => any>(callback: T, delay = 250) {
    const timeout = useRef<any>(undefined);

    return (...args: Parameters<T>) => {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => callback(...args), delay);
    };
}