'use client';

import { createContext, use, useCallback, useRef, useState } from "react";

type DefinitionsContext = {
    shouldRender(key: string, id: string): boolean;
};

export const DefinitionsContext = createContext<DefinitionsContext | null>(null);

export function useDefinitions() {
    const context = use(DefinitionsContext);

    if (!context) throw new Error('Unable to access Definitions context');

    return context;
}

export default function DefinitionsProvider({ children }: {
    children: React.ReactNode;
}) {
    const assigned = useRef<{
        [key: string]: string;
    }>({});
    const [register, setRegister] = useState<{
        [key: string]: string;
    }>({});

    const updateRegister = (updated: { [key: string]: string; }) => setRegister({ ...updated });

    const shouldRender = useCallback((key: string, id: string) => {
        const assignedKey = assigned.current[id];

        if (assignedKey && assignedKey !== key) {
            delete register[assigned.current[id]];
            delete assigned.current[id];
            updateRegister(register);
        }

        if (key in register) return register[key] === id;

        assigned.current[id] = key;
        register[key] = id;
        updateRegister(register);

        return true;
    }, [register]);

    return <DefinitionsContext value={{ shouldRender }}>
        {children}
    </DefinitionsContext>;
}