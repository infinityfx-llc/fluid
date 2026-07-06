'use client';

import MenuManager from "../../../context/menu-manager";
import { PopoverRoot } from "../../layout/popover";
import type { PopoverRoot as PopoverRootProps } from "../../layout/popover/root";

/**
 * Displays a list of selectable options that can be searched through.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/combobox}
 */
export default function Root({ round, variant, autoFocus = true, ...props }: PopoverRootProps & {
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
        <PopoverRoot {...props}>
            {props.children}
        </PopoverRoot>
    </MenuManager>;
}

Root.displayName = 'ComboboxRoot';