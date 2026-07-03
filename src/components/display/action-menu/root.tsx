'use client';

import MenuManager from "../../../context/menu-manager";
import Popover from "../../layout/popover";
import type { PopoverRoot } from "../../layout/popover/root";

export default function Root({ variant, ...props }: PopoverRoot & {
    round?: boolean;
    variant?: 'default' | 'inverted';
    autoFocus?: boolean;
}) {

    return <MenuManager variant={props.mobileContainer === 'modal' ? 'default' : variant}>
        <Popover.Root {...props}>
            {props.children}
        </Popover.Root>
    </MenuManager>;
}

Root.displayName = 'ActionMenu.Root';