'use client';

import { getFocusable } from "../../../core/utils";
import Popover from "../../layout/popover";
import { usePopover } from "../../layout/popover/root";
import { PopoverTrigger } from "../../layout/popover/trigger";

// todo: on open focus first item

export default function Trigger(props: PopoverTrigger) {
    const { content } = usePopover();

    return <Popover.Trigger
        {...props}
        aria-haspopup="menu"
        onKeyDown={e => {
            props.children.props.onKeyDown?.(e);
            props.onKeyDown?.(e);

            if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowDown') { // maybe also on arrow up?
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

Trigger.displayName = 'ActionMenu.Trigger';