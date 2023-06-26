'use client';

import { createContext, useState, useRef } from "react";

type LayoutContext = {
    collapsed: boolean;
    onCollapse: (value: boolean) => void;
    sidebar: React.MutableRefObject<string | undefined>;
    header: React.MutableRefObject<string | undefined>;
}

export const LayoutContext = createContext<LayoutContext | null>(null);

export default function LayoutProvider({ children }: { children: React.ReactNode; }) {
    const sidebar = useRef(undefined);
    const header = useRef(undefined);
    const [collapsed, onCollapse] = useState(false);

    return <LayoutContext.Provider value={{ collapsed, onCollapse, sidebar, header }}>
        {children}
    </LayoutContext.Provider>
}