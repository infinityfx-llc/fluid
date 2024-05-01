'use client';

import { forwardRef } from 'react';
import { Selectors } from '../../../../src/types';
import { classes, combineClasses } from '../../../../src/core/utils';
import { createStyles } from '../../../core/style';
import { useSidebar } from './root';

const styles = createStyles('sidebar.heading', fluid => ({
    '.heading': {
        color: 'var(--f-clr-text-100)',
        fontSize: 'var(--f-font-size-xsm)',
        fontWeight: 800,
        width: 'max-content',
        transition: 'opacity .3s',
        padding: '0 1em',
        marginTop: 'var(--f-spacing-lrg)'
    },

    [`@media (min-width: ${fluid.breakpoints.mob + 1}px)`]: {
        '.heading.collapsed': {
            opacity: 0
        }
    }
}));

export type SidebarHeadingSelectors = Selectors<'heading'>;

const Heading = forwardRef(({ children, cc = {}, ...props }:
    {
        cc?: SidebarHeadingSelectors;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = combineClasses(styles, cc);
    
    const { collapsed } = useSidebar();

    return <div ref={ref} {...props}
        className={classes(
            style.heading,
            collapsed && style.collapsed,
            props.className
        )}>
        {children}
    </div>;
});

Heading.displayName = 'Sidebar.Heading';

export default Heading;