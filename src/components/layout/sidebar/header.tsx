'use client';

import { forwardRef } from 'react';
import { FluidStyles, Selectors } from '../../../../src/types';
import { classes, combineClasses } from '../../../../src/core/utils';
import { createStyles } from '../../../core/style';
import { useSidebar } from './root';
import { Toggle } from '../../input';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

const Header = forwardRef(({ children, cc = {}, toggle = true, ...props }:
    {
        cc?: Selectors<'header'>;
        toggle?: boolean;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('sidebar.header', {
        '.header': {
            display: 'flex',
            alignItems: 'center',
            padding: '1em'
        },

        '.toggle': {
            marginLeft: 'auto',
            backgroundColor: 'transparent !important',
            color: 'var(--f-clr-text-100) !important'
        }
    });
    const style = combineClasses(styles, cc);
    const { collapsed, onCollapse } = useSidebar();

    return <div ref={ref} {...props} className={classes(style.header, props.className)}>
        {children}

        {toggle && <Toggle
            variant="minimal"
            className={style.toggle}
            checked={!collapsed}
            checkedContent={<MdArrowBack />}
            onChange={() => onCollapse(!collapsed)}>
            <MdArrowForward />
        </Toggle>}
    </div>;
});

Header.displayName = 'Sidebar.Header';

export default Header;