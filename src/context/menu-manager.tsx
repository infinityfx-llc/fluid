'use client';

import { createContext, use, useRef, useState } from "react";

type MenuContext = {
    round: boolean;
    variant: 'default' | 'inverted';
    searchQuery: string;
    setSearchQuery(value: string): void;
    focusIndex: number;
    setFocus(index: number): void;
    focusList: (HTMLElement | null)[];
    virtualView: {
        from: number;
        to: number;
    };
    setVirtualView(view: {
        from: number;
        to: number;
    }): void;
    // scroll position
};

export const MenuContext = createContext<MenuContext | null>(null);

export function useMenuManager() {
    const context = use(MenuContext);

    if (!context) throw new Error('Unable to access MenuManager context');

    return context;
}

export default function MenuManager({ children, variant = 'default', round = false, autoFocus }: {
    children: React.ReactNode;
    round?: boolean;
    variant?: 'default' | 'inverted';
    autoFocus?: boolean;
}) {
    const [virtualView, setVirtualView] = useState({
        from: 0,
        to: Infinity
    });
    const [searchQuery, setSearchQuery] = useState('');
    const data = useRef<{
        focusList: (HTMLElement | null)[],
        focusIndex: number;
    }>({
        focusList: [],
        focusIndex: autoFocus ? 0 : -1
    });

    const { focusList, focusIndex } = data.current;

    function setFocus(index: number) {
        data.current.focusIndex = index;
    }

    return <MenuContext value={{ focusList, focusIndex, variant, round, searchQuery, virtualView, setSearchQuery, setFocus, setVirtualView }}>
        {children}
    </MenuContext>;
}