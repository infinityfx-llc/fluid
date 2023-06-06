import { createContext, useRef, useState } from "react";
import { FluidSize } from "../types";

export type LayoutData = {
    sidebar: boolean;
    header: boolean | FluidSize;
    collapsed: boolean;
};

type LayoutContext = LayoutData & {
    mutate: (data: any) => void;
};

export const InitialLayoutdata = {
    sidebar: false,
    header: false,
    collapsed: false
};

export const LayoutContext = createContext<LayoutContext | null>(null);

export default function LayoutProvider({ children }: { children: React.ReactNode; }) {
    const data = useRef<LayoutData>(InitialLayoutdata);
    const [state, setState] = useState(data.current);

    function mutate(partial: Partial<LayoutData>) {
        Object.assign(data.current, partial);

        setState(Object.assign({}, data.current));
    }

    return <LayoutContext.Provider value={{ ...state, mutate }}>
        {children}
    </LayoutContext.Provider>
}