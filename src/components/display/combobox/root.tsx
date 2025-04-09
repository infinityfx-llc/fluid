'use client';

import Popover from "../../layout/popover";
import type { PopoverRoot } from "../../layout/popover/root";

export default function Root(props: PopoverRoot) {

    return <Popover.Root {...props}>
        {props.children}
    </Popover.Root>;
}

Root.displayName = 'Combobox.Root';