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
    mutableView: React.RefObject<{ from: number; to: number; }>;
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
            index: number;
        }>;
    }>({
        visibleCount: 0,
        focusCount: 0,
        list: new Map()
    });
    const focus = useRef({
        list: [] as (HTMLElement | null)[],
        index: autoFocus ? 0 : -1
    });
    const [optionCount, setOptionCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const mutableView = useRef({ from: 0, to: Infinity });
    const [virtualView, setVirtualView] = useState(mutableView.current);

    const updateVirtualView = (view: { from: number; to: number; }) => setVirtualView(mutableView.current = view);

    function initOptionsList(searchable: boolean) {
        options.current.list.clear();
        options.current.focusCount = searchable ? 1 : 0;
        options.current.visibleCount = 0;
    };

    const registerOption = useCallback((id: string, element: React.RefObject<HTMLElement | null> | null, value: FluidInputvalue) => {
        if (options.current.list.has(id)) {
            const { visible, index } = options.current.list.get(id)!;

            return [visible, index] as const;
        };

        let visible = ('' + value).toLowerCase().includes(searchQuery),
            index = options.current.focusCount;

        if (visible && element) {
            options.current.focusCount++;
        } else {
            index = -1;
        }

        if (visible) {
            const visibleIndex = options.current.visibleCount++;
            const { from, to } = mutableView.current;

            if (to !== Infinity && (
                visibleIndex < from ||
                visibleIndex > to
            )) visible = false;
        }

        options.current.list.set(id, {
            element: element ? element : { current: null },
            visible,
            index
        });

        return [visible, index] as const;
    }, [searchQuery]);

    function filterOptionsList(searchElement: HTMLElement | null) {
        let count = 0,
            list: (HTMLElement | null)[] = searchElement ? [searchElement] : [];

        for (const { element, visible, index } of options.current.list.values()) {
            if (index >= 0) list[index] = element.current;
            if (!visible) continue;

            count += 1;
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
        mutableView,
        virtualView,
        setVirtualView: updateVirtualView,
        initOptionsList,
        registerOption,
        filterOptionsList
    }}>
        {children}
    </MenuContext>;
}
