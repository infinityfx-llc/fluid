'use client';

import Popover from "../../layout/popover";
import { PopoverTrigger } from "../../layout/popover/trigger";

export default function Trigger(props: PopoverTrigger) {
    
    // aria-autocomplete="list"
    return <Popover.Trigger {...props} role="combobox">
        {props.children}
    </Popover.Trigger>;
}

Trigger.displayName = 'Combobox.Trigger';