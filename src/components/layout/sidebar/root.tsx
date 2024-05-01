'use client';

import { Selectors } from '../../../../src/types';
import { forwardRef, createContext, useContext, Children } from 'react';
import Scrollarea from '../scrollarea';
import { classes, combineClasses } from '../../../../src/core/utils';
import { createStyles } from '../../../core/style';

export const SidebarContext = createContext<{
    collapsed: boolean;
    onCollapse: (value: boolean) => void;
}>({
    collapsed: false,
    onCollapse: () => {}
});

export function useSidebar() {
    return useContext(SidebarContext);
}

const styles = createStyles('sidebar.root', fluid => ({
    '.sidebar': {
        position: 'fixed',
        inset: 'var(--f-spacing-med)',
        right: 'auto',
        zIndex: 500,
        backgroundColor: 'var(--f-clr-fg-100)',
        boxShadow: 'var(--f-shadow-sml)',
        border: 'solid 1px var(--f-clr-fg-200)',
        borderRadius: 'var(--f-radius-lrg)',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '1em',
        transition: 'width .3s, translate .3s, opacity .3s'
    },

    '.content': {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--f-spacing-xsm)',
        padding: '0 1em',
        minHeight: '100%',
        overflow: 'hidden'
    },

    [`@media (min-width: ${fluid.breakpoints.mob + 1}px)`]: {
        '.sidebar[data-collapsed="true"]': {
            width: 'calc(3rem + 2em) !important'
        }
    },

    [`@media (max-width: ${fluid.breakpoints.mob}px)`]: {
        '.sidebar[data-collapsed="true"]': {
            translate: 'calc(-100% - 1em) 0%'
        }
    }
}));

export type SidebarRootSelectors = Selectors<'sidebar' | 'content'>;

const Root = forwardRef(({ children, cc = {}, size = '18rem', collapsed, onCollapse, ...props }:
    {
        cc?: SidebarRootSelectors;
        size?: string;
        collapsed: boolean;
        onCollapse: (value: boolean) => void;
    } & React.HTMLAttributes<HTMLElement>, ref: React.ForwardedRef<HTMLElement>) => {
    const style = combineClasses(styles, cc);

    const [header, ...nodes] = Children.toArray(children);

    return <SidebarContext.Provider value={{ collapsed, onCollapse }}>
        <aside ref={ref} {...props} className={classes(style.sidebar, props.className)} style={{ ...props.style, width: size }} data-collapsed={collapsed}>
            {header}

            <Scrollarea style={{ flexGrow: 1 }}>
                <div className={style.content}>
                    {nodes}
                </div>
            </Scrollarea>
        </aside>
    </SidebarContext.Provider>;
});

Root.displayName = 'Sidebar.Root';

export default Root;