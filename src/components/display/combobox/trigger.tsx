'use client';

import { getFocusable } from "../../../core/utils";
import { PopoverTrigger } from "../../layout/popover";
import { usePopover } from "../../layout/popover/root";
import type { PopoverTrigger as PopoverTriggerProps } from "../../layout/popover/trigger";

export default function Trigger(props: PopoverTriggerProps) {
    const { content } = usePopover();

    // aria-autocomplete="list"
    return <PopoverTrigger
        {...props}
        role="combobox"
        onKeyDown={e => {
            props.children.props.onKeyDown?.(e);
            props.onKeyDown?.(e);

            if (e.key === ' ' || e.key === 'Enter') e.preventDefault();

            if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowDown') {
                const child = getFocusable(content.current, false);

                if (child) {
                    e.preventDefault();
                    child.focus();
                }
            }
        }}>
        {props.children}
    </PopoverTrigger>;
}

Trigger.displayName = 'ComboboxTrigger';