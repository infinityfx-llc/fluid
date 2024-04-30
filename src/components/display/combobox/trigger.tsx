'use client';

import { getFocusable } from "../../../core/utils";
import Popover from "../../layout/popover";
import { usePopover } from "../../layout/popover/root";
import { PopoverTrigger } from "../../layout/popover/trigger";

export default function Trigger(props: PopoverTrigger) {
    const { content } = usePopover();

    // aria-autocomplete="list"
    return <Popover.Trigger {...props} role="combobox" onKeyDown={e => {
        props.children.props.onKeyDown?.(e);
        props.onKeyDown?.(e);

        if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowDown') {
            const child = getFocusable(content.current, false);
            if (child) {
                e.preventDefault();
                child.focus();
            }
        }
    }}>
        {props.children}
    </Popover.Trigger>;
}

Trigger.displayName = 'Combobox.Trigger';