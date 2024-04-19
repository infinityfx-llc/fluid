'use client';

import { forwardRef } from 'react';
import { FluidStyles, Selectors } from '../../../../src/types';
import { classes, combineClasses } from '../../../../src/core/utils';
import { createStyles } from '../../../core/style';
import { useSidebar } from './root';
import Toggle from '../../input/toggle';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const Header = forwardRef(({ children, cc = {}, toggle = 'square', ...props }:
    {
        cc?: Selectors<'header'>;
        toggle?: 'square' | 'round' | 'none';
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('sidebar.header', fluid => ({
        '.header': {
            display: 'flex',
            alignItems: 'center',
            padding: '1em'
        },

        '.toggle': {
            marginLeft: 'auto',
            translate: 'calc(var(--f-spacing-med) + 50%) 0%',
            boxShadow: 'var(--f-shadow-sml)',
            transition: 'translate .3s, background-color .25s, color .25s !important'
        },

        [`@media (max-width: ${fluid.breakpoints.mob}px)`]: {
            '.toggle[data-collapsed="true"]': {
                translate: 'calc(var(--f-spacing-med) * 2 + 100%) 0%'
            }
        }
    }));
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
            checkedContent={<MdChevronRight />}
            onChange={() => onCollapse(!collapsed)}>
            <MdChevronLeft />
        </Toggle>}
    </div>;
});

Header.displayName = 'Sidebar.Header';

export default Header;