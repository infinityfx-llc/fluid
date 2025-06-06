'use client';

import { createContext, use } from "react";
import { Selectors } from "../../../types";
import { createStyles } from "../../../core/style";
import { classes, combineClasses } from "../../../core/utils";

export const SidebarContext = createContext<{
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}>({
    collapsed: false,
    setCollapsed: () => { }
});

export function useSidebar() {
    return use(SidebarContext);
}

const styles = createStyles('sidebar.root', {
    '.sidebar': {
        display: 'flex',
        flexDirection: 'column',
        paddingInline: '1em',
        overflow: 'hidden',
        transition: 'width .3s, translate .3s'
    },

    '.sidebar.collapsed': {
        width: '5em !important'
    }
});

export type SidebarRootSelectors = Selectors<'sidebar' | 'collapsed'>;

export default function Root({ children, cc = {}, collapsed, setCollapsed, ...props }: {
    ref?: React.Ref<HTMLElement>;
    cc?: SidebarRootSelectors;
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
} & React.HTMLAttributes<HTMLElement>) {
    const style = combineClasses(styles, cc);

    return <SidebarContext value={{ collapsed, setCollapsed }}>
        <aside {...props} className={classes(
            style.sidebar,
            collapsed && style.collapsed,
            props.className
        )}>
            {children}
        </aside>
    </SidebarContext>;
}

Root.displayName = 'Sidebar.Root';