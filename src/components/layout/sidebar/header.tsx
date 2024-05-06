'use client';

import { forwardRef } from 'react';
import { Selectors } from '../../../../src/types';
import { classes, combineClasses } from '../../../../src/core/utils';
import { createStyles } from '../../../core/style';
import { useSidebar } from './root';
import Toggle from '../../input/toggle';
import { Icon } from '../../../core/icons';

const styles = createStyles('sidebar.header', fluid => ({
    '.header': {
        display: 'flex',
        alignItems: 'center',
        padding: '1em'
    },

    '.header .toggle': {
        marginLeft: 'auto',
        translate: 'calc(var(--f-spacing-med) + 50%) 0%',
        boxShadow: 'var(--f-shadow-sml)',
        transition: 'translate .3s, background-color .25s, color .25s'
    },

    [`@media (max-width: ${fluid.breakpoints.mob}px)`]: {
        '.toggle[data-collapsed="true"]': {
            translate: 'calc(var(--f-spacing-med) * 2 + 100%) 0%'
        }
    }
}));

export type SidebarHeaderSelectors = Selectors<'header'>;

const Header = forwardRef(({ children, cc = {}, toggle = 'square', ...props }:
    {
        cc?: SidebarHeaderSelectors;
        toggle?: 'square' | 'round' | 'none';
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = combineClasses(styles, cc);
    const { collapsed, onCollapse } = useSidebar();

    return <div ref={ref} {...props} className={classes(style.header, props.className)}>
        {children}

        {toggle !== 'none' && <Toggle
            data-collapsed={collapsed}
            compact
            size="sml"
            round={toggle === 'round'}
            className={style.toggle}
            checked={collapsed}
            checkedContent={<Icon type="right" />}
            onChange={() => onCollapse(!collapsed)}>
            <Icon type="left" />
        </Toggle>}
    </div>;
});

Header.displayName = 'Sidebar.Header';

export default Header;