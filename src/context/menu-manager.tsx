'use client';

import { createContext, use, useCallback, useRef, useState } from "react";
import { FluidInputvalue } from "../types";

type MenuContext = {
    round: boolean;
    variant: 'default' | 'inverted';
    autoFocus: boolean;
    optionCount: number;
    focus: React.RefObject<{
        list: (HTMLElement | null)[];
        index: number;
    }>;
    searchQuery: string;
    setSearchQuery(value: string): void;
    virtualView: {
        from: number;
        to: number;
    };
    setVirtualView(view: {
        from: number;
        to: number;
    }): void;
    initOptionsList(searchable: boolean): void;
    registerOption(id: string, element: React.RefObject<HTMLElement | null> | null, value: FluidInputvalue): readonly [boolean, number];
    filterOptionsList(searchElement: HTMLElement | null): number;
};

export const MenuContext = createContext<MenuContext | null>(null);

export function useMenuManager() {
    const context = use(MenuContext);

    if (!context) throw new Error('Unable to access MenuManager context');

    return context;
}

export default function MenuManager({ children, variant = 'default', round = false, autoFocus = false }: {
    children: React.ReactNode;
    round?: boolean;
    variant?: 'default' | 'inverted';
    autoFocus?: boolean;
}) {
    const options = useRef<{
        visibleCount: number;
        focusCount: number;
        list: Map<string, {
            element: React.RefObject<HTMLElement | null>;
            visible: boolean;
            inView: boolean;
            index: number;
        }>;
    }>({
        visibleCount: 0,
        focusCount: 0,
        list: new Map()
    });
    const focus = useRef({
        list: [] as HTMLElement[],
        index: autoFocus ? 0 : -1
    });
    const [optionCount, setOptionCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [virtualView, setVirtualView] = useState({
        from: 0,
        to: Infinity
    });

    function initOptionsList(searchable: boolean) {
        options.current.list = new Map();
        options.current.focusCount = searchable ? 1 : 0;
    };

    const registerOption = useCallback((id: string, element: React.RefObject<HTMLElement | null> | null, value: FluidInputvalue) => {
        if (options.current.list.has(id)) {
            const { visible, inView, index } = options.current.list.get(id)!;

            return [visible && inView, index] as const;
        };

        const visible = ('' + value).toLowerCase().includes(searchQuery);
        let inView = true;

        if (visible) {
            const visibleIndex = ++options.current.visibleCount;

            inView = virtualView.to === Infinity || (
                visibleIndex >= virtualView.from &&
                visibleIndex <= virtualView.to
            );
        }

        const index = options.current.focusCount;
        options.current.list.set(id, {
            element: element ? element : { current: null },
            visible,
            inView,
            index
        });
        
        if (visible && element) options.current.focusCount += 1;

        return [visible && inView, index] as const;
    }, [searchQuery, virtualView]);

    function filterOptionsList(searchElement: HTMLElement | null) {
        let count = 0, list = searchElement ? [searchElement] : [];

        for (const { element, visible } of options.current.list.values()) {
            if (!visible) continue;

            count += 1;
            if (element.current) list.push(element.current);
        }

        focus.current.list = list;
        setOptionCount(count);

        return count;
    }

    return <MenuContext value={{
        round,
        variant,
        autoFocus,
        optionCount,
        focus,
        searchQuery,
        setSearchQuery,
        virtualView,
        setVirtualView,
        initOptionsList,
        registerOption,
        filterOptionsList
    }}>
        {children}
    </MenuContext>;
}
