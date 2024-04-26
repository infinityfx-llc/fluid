'use client';

import Popover from "../../layout/popover";
import { PopoverTrigger } from "../../layout/popover/trigger";

export default function Trigger(props: PopoverTrigger) {

    return <Popover.Trigger {...props} aria-haspopup="menu">
        {props.children}
    </Popover.Trigger>;
}

Trigger.displayName = 'ActionMenu.Trigger';