'use client';

import { FluidStyles, Selectors } from '../../../../src/types';
import { forwardRef, useState, createContext, useContext } from 'react';
import Toggle from '../../input/toggle';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import Scrollarea from '../scrollarea';
import { classes, combineClasses } from '../../../../src/core/utils';
import { createStyles } from '../../../core/style';

export const SidebarContext = createContext<{
    collapsed: boolean;
}>({ collapsed: false });

export function useSidebar() {
    return useContext(SidebarContext);
}

const Root = forwardRef(({ children, cc = {}, size = '18rem', collapsed, onCollapse, ...props }:
    {
        cc?: Selectors<'sidebar' | 'button' | 'header' | 'content'>;
        size?: string;
        collapsed?: boolean;
        onCollapse?: (value: boolean) => void;
    } & React.HTMLAttributes<any>, ref: React.ForwardedRef<HTMLElement>) => {
    const [isCollapsed, setCollapsed] = collapsed !== undefined ? [collapsed] : useState(false);

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
            boxShadow: '0 0 12px rgb(0, 0, 0, .05)',
            borderRight: 'solid 1px var(--f-clr-grey-100)',
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '1em',
            transition: 'width .3s, translate .3s, opacity .3s'
        },

        '.button': {
            marginLeft: 'auto'
        },

        '.header': {
            display: 'flex',
            alignItems: 'center',
            padding: '1em',
            flexShrink: 0
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

    return <SidebarContext.Provider value={{ collapsed: isCollapsed }}>
        <aside ref={ref} {...props} className={classes(style.sidebar, props.className)} style={{ ...props.style, width: size }} data-collapsed={isCollapsed}>
            <div className={style.header}>
                <Toggle variant="neutral" checkedContent={<MdArrowBack />} checked={!isCollapsed} onChange={e => {
                    setCollapsed?.(!e.target.checked);
                    onCollapse?.(!e.target.checked);
                }} className={style.button}>
                    <MdArrowForward />
                </Toggle>
            </div>

            <Scrollarea style={{ flexGrow: 1 }}>
                <div className={style.content}>
                    {children}
                </div>
            </Scrollarea>
        </aside>
    </SidebarContext.Provider>;
});

Root.displayName = 'Sidebar.Root';

export default Root;