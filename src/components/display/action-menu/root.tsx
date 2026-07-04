'use client';

import MenuManager from "../../../context/menu-manager";
import Popover from "../../layout/popover";
import type { PopoverRoot } from "../../layout/popover/root";

export default function Root({ round, variant, autoFocus = true, ...props }: Omit<PopoverRoot, 'mobileContainer'> & {
    round?: boolean;
    variant?: 'default' | 'inverted';
    /**
     * Focus the first item when opening the menu.
     * 
     * @default true
     */
    autoFocus?: boolean;
}) {

    return <MenuManager
        round={round}
        variant={variant}
        autoFocus={autoFocus}>
        <Popover.Root {...props}>
            {props.children}
        </Popover.Root>
    </MenuManager>;
}

Root.displayName = 'ActionMenu.Root';