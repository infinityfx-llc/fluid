'use client';

import { FluidStyles, Selectors } from '../../../../src/types';
import { forwardRef, createContext, useContext, Children, isValidElement } from 'react';
import Scrollarea from '../scrollarea';
import { classes, combineClasses } from '../../../../src/core/utils';
import { createStyles } from '../../../core/style';
import Header from './header';

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

const Root = forwardRef(({ children, cc = {}, size = '18rem', collapsed, onCollapse, ...props }:
    {
        cc?: Selectors<'sidebar' | 'button' | 'content'>;
        size?: string;
        collapsed: boolean;
        onCollapse: (value: boolean) => void;
    } & React.HTMLAttributes<any>, ref: React.ForwardedRef<HTMLElement>) => {

    const styles = createStyles('sidebar.root', (fluid) => ({
        '.sidebar': {
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100dvh',
            zIndex: 500,
            backgroundColor: 'var(--f-clr-bg-100)',
            borderTopRightRadius: 'var(--f-radius-lrg)',
            borderBottomRightRadius: 'var(--f-radius-lrg)',
            boxShadow: 'var(--f-shadow-med)',
            borderRight: 'solid 1px var(--f-clr-fg-200)',
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '1em',
            transition: 'width .3s, translate .3s, opacity .3s'
        },

        '.button': {
            marginLeft: 'auto'
        },

        '.content': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xsm)',
            padding: '0 1em',
            minHeight: '100%',
            overflow: 'hidden'
        },

        [`@media (min-width: ${fluid.breakpoints.tab + 1}px)`]: {
            '.sidebar[data-collapsed="true"]': {
                width: 'calc(3rem + 2em) !important'
            }
        },

        [`@media (max-width: ${fluid.breakpoints.tab}px)`]: {
            '.sidebar[data-collapsed="true"]': {
                translate: '-100% 0%'
            }
        },
    }));
    const style = combineClasses(styles, cc);
    const header = Children.toArray(children).find(child => isValidElement(child) && child.type === Header);

    return <SidebarContext.Provider value={{ collapsed, onCollapse }}>
        <aside ref={ref} {...props} className={classes(style.sidebar, props.className)} style={{ ...props.style, width: size }} data-collapsed={collapsed}>
            {header}

            <Scrollarea style={{ flexGrow: 1 }}>
                <div className={style.content}>
                    {Children.map(children, child => !isValidElement(child) || child.type !== Header ? child : null)}
                </div>
            </Scrollarea>
        </aside>
    </SidebarContext.Provider>;
});

Root.displayName = 'Sidebar.Root';

export default Root;