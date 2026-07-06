'use client';

import MenuManager from "../../../context/menu-manager";
import { PopoverRoot } from "../../layout/popover";
import type { PopoverRoot as PopoverRootProps } from "../../layout/popover/root";

/**
 * Displays a menu with actions or options.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/action-menu}
 */
export default function Root({ round, variant, autoFocus = false, ...props }: Omit<PopoverRootProps, 'mobileContainer'> & {
    round?: boolean;
    variant?: 'default' | 'inverted';
    /**
     * Focus the first item when opening the menu.
     * 
     * @default false
     */
    autoFocus?: boolean;
}) {

    return <MenuManager
        round={round}
        variant={variant}
        autoFocus={autoFocus}>
        <PopoverRoot {...props}>
            {props.children}
        </PopoverRoot>
    </MenuManager>;
}

Root.displayName = 'ActionMenuRoot';