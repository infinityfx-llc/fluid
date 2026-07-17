'use client';

import { createContext, use, useCallback, useEffect, useId, useRef, useState } from "react";

type SingletonsContext = {
    shouldRender(key: string, id: string): boolean;
    unmount(id: string): void;
};

export const SingletonsContext = createContext<SingletonsContext | null>(null);

export function useSingleton(key: string) {
    const id = useId();
    const context = use(SingletonsContext);

    if (!context) throw new Error('Unable to access Singletons context');

    useEffect(() => () => context.unmount(id), []);

    return () => context.shouldRender(key, id);
}

export default function SingletonsProvider({ children }: {
    children: React.ReactNode;
}) {
    const assigned = useRef<{
        [key: string]: string;
    }>({});
    const mutableRegister = useRef<{
        [key: string]: string;
    }>({});
    const [updates, update] = useState(0);

    const shouldRender = useCallback((key: string, id: string) => {
        const assignedKey = assigned.current[id];

        if (assignedKey && assignedKey !== key) {
            delete mutableRegister.current[assigned.current[id]];
            delete assigned.current[id];

            setTimeout(() => update(updates + 1));
        }

        if (key in mutableRegister.current) return mutableRegister.current[key] === id;

        assigned.current[id] = key;
        mutableRegister.current[key] = id;

        return true;
    }, [updates]);

    function unmount(id: string) {
        const assignedKey = assigned.current[id];

        if (assignedKey) {
            delete mutableRegister.current[assigned.current[id]];
            delete assigned.current[id];

            setTimeout(() => update(updates + 1));
        }
    }

    return <SingletonsContext value={{ shouldRender, unmount }}>
        {children}
    </SingletonsContext>;
}