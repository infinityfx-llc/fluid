'use client';

import { useRef, useState } from "react";
import Popover from "../../layout/popover";
import type { PopoverRoot } from "../../layout/popover/root";
import { useDebounce } from "../../../hooks";

export type ComboboxContext = {
    query: string;
    search: (value: string) => void;
    view: {
        from: number;
        to: number;
    };
    setView: (view: {
        from: number;
        to: number;
    }) => void;
    selection: React.RefObject<{ // rename??
        list: (HTMLElement | null)[];
        map: Map<string, number>;
        index: number;
    }>;
    getIndex: (id: string) => number;
}

export default function Root({ autoFocus, round, ...props }: {
    searchable?: boolean;
    autoFocus?: boolean;
    round?: boolean;
} & PopoverRoot) {
    const selection = useRef({
        list: [],
        map: new Map<string, number>(),
        index: autoFocus ? 0 : -1 // not correct when has search field..
    });
    const [view, setView] = useState({ from: 0, to: 1 });
    const [query, setQuery] = useState('');
    const search = useDebounce(setQuery, 200);

    function getIndex(id: string) {
        const { map } = selection.current;
        if (!map.has(id)) map.set(id, map.size);

        return map.get(id);
    }

    return <Popover.Root
        {...props}
        data={{
            query,
            search,
            view,
            setView,
            selection,
            getIndex
        }}>
        {props.children}
    </Popover.Root>;
}

Root.displayName = 'Combobox.Root';