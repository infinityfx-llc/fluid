'use client';

import MenuManager from "../../../context/menu-manager";
import Popover from "../../layout/popover";
import type { PopoverRoot } from "../../layout/popover/root";

export default function Root({ round, variant, autoFocus, ...props }: PopoverRoot & {
    round?: boolean;
    variant?: 'default' | 'inverted';
    autoFocus?: boolean;
}) {

    // TODO: should actually use isModal..
    return <MenuManager
        round={round}
        variant={props.mobileContainer === 'modal' ? 'default' : variant}
        autoFocus={autoFocus}>
        <Popover.Root {...props}>
            {props.children}
        </Popover.Root>
    </MenuManager>;
}

Root.displayName = 'Combobox.Root';