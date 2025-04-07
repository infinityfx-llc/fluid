'use client';

import { useRef, useState } from "react";
import Popover from "../../layout/popover";
import type { PopoverRoot } from "../../layout/popover/root";

export type ComboboxContext = {
    searchable: boolean;
    query: string;
    setQuery: (value: string) => void;
    view: {
        start: number;
        end: number;
    };
    setView: (view: {
        start: number;
        end: number;
    }) => void;
    focus: React.RefObject<{
        list: (HTMLElement | null)[];
        index: number;
    }>;
}

export default function Root({ autoFocus = true, searchable = false, ...props }: {
    autoFocus?: boolean;
    searchable?: boolean;
} & PopoverRoot) {
    const focus = useRef({
        list: [],
        index: autoFocus ? 0 : -1
    });

    const [query, setQuery] = useState('');
    const [view, setView] = useState({ start: 0, end: Infinity });

    return <Popover.Root
        {...props}
        data={{
            searchable,
            query,
            setQuery,
            view,
            setView,
            focus
        }}>
        {props.children}
    </Popover.Root>;
}

Root.displayName = 'Combobox.Root';