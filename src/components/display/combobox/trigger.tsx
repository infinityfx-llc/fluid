'use client';

import Popover from "../../layout/popover";
import { PopoverTrigger } from "../../layout/popover/trigger";

export default function Trigger(props: PopoverTrigger) {
    
    return <Popover.Trigger {...props}>
        {props.children}
    </Popover.Trigger>;
}

Trigger.displayName = 'Combobox.Trigger';