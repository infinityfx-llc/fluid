'use client';

import { useRef } from "react";
import Popover from "../../layout/popover";
import type { PopoverRoot } from "../../layout/popover/root";

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
    autoFocus?: boolean;
    round?: boolean;
} & PopoverRoot) {
    const selection = useRef({
        list: [],
        map: new Map<string, number>(),
        index: autoFocus ? 0 : -1 // not correct when has search field..
    });

    return <Popover.Root
        {...props}
        data={{
            selection
        }}>
        {props.children}
    </Popover.Root>;
}

Root.displayName = 'Combobox.Root';