'use client';

import { Selectors } from "../../../../src/types";
import { classes } from "../../../../src/utils";
import { createContext, use, useId, useRef, useState } from "react";
import { createStyles } from "../../../core/style";
import { combineClasses, combineRefs } from "../../../core/utils";

export const NavigationMenuContext = createContext<{
    root: React.RefObject<HTMLElement | null>;
    id: string;
    selection: string | undefined;
    select: (id?: string) => void;
} | null>(null);

export function useNavigationMenu() {
    const context = use(NavigationMenuContext);

    if (!context) throw new Error('Unable to access NavigationMenuRoot context');

    return context;
}

const styles = createStyles('navigation-menu.root', {
    '.navigation': {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-sml)',
        height: '100%',
        isolation: 'isolate',
        paddingBlock: 'var(--f-spacing-sml)'
    }
});

export type NavigationMenuRootSelectors = Selectors<'navigation'>;

export default function Root({ children, cc = {}, ref, ...props }:
    {
        ref?: React.Ref<HTMLElement>;
        cc?: NavigationMenuRootSelectors;
    } & React.HTMLAttributes<HTMLElement>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const root = useRef<HTMLElement>(null);
    const [selection, setSelection] = useState<string | undefined>(undefined);

    return <nav ref={combineRefs(ref, root)} {...props}
        role="menubar"
        className={classes(style.navigation, props.className)}
        onMouseLeave={e => {
            props.onMouseLeave?.(e);
            setSelection(undefined);
        }}>
        <NavigationMenuContext value={{ root, id, selection, select: setSelection }}>
            {children}
        </NavigationMenuContext>
    </nav>;
}

Root.displayName = 'NavigationMenu.Root';