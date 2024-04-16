'use client';

import { FluidStyles, Selectors } from "../../../../src/types";
import { classes } from "../../../../src/utils";
import { createContext, forwardRef, useContext, useId, useRef, useState } from "react";
import { createStyles } from "../../../core/style";
import { combineClasses, combineRefs } from "../../../core/utils";

export const NavigationMenuContext = createContext<{
    root: React.RefObject<HTMLElement>;
    id: string;
    selection: string | undefined;
    select: (id?: string) => void;
} | null>(null);

export function useNavigationMenu() {
    const context = useContext(NavigationMenuContext);

    if (!context) throw new Error('Unable to access NavigationMenuRoot context');

    return context;
}

const Root = forwardRef(({ children, cc = {}, ...props }:
    {
        cc?: Selectors<'navigation'>;
    } & React.HTMLAttributes<HTMLElement>, ref: React.ForwardedRef<HTMLElement>) => {
    const styles = createStyles('navigation-menu.root', {
        '.navigation': {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-sml)',
            height: '100%'
        }
    });
    const style = combineClasses(styles, cc);

    const id = useId();
    const root = useRef<HTMLElement>(null);
    const [selection, setSelection] = useState<string | undefined>(undefined);

    return <nav ref={combineRefs(ref, root)} {...props}
        className={classes(style.navigation, props.className)}
        onMouseLeave={e => {
            props.onMouseLeave?.(e);
            setSelection(undefined);
        }}>
        <NavigationMenuContext.Provider value={{ root, id, selection, select: setSelection }}>
            {children}
        </NavigationMenuContext.Provider>
    </nav>;
});

Root.displayName = 'NavigationMenu.Root';

export default Root;