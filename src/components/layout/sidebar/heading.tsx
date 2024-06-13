'use client';

import { Selectors } from '../../../../src/types';
import { classes, combineClasses } from '../../../../src/core/utils';
import { createStyles } from '../../../core/style';
import { useSidebar } from './root';

const styles = createStyles('sidebar.heading', {
    '.heading': {
        color: 'var(--f-clr-text-100)',
        fontSize: 'var(--f-font-size-xsm)',
        fontWeight: 800,
        width: 'max-content',
        transition: 'opacity .3s',
        padding: '0 1rem'
    },

    '.heading.collapsed': {
        opacity: 0
    }
});

export type SidebarHeadingSelectors = Selectors<'heading' | 'collapsed'>;

export default function Heading({ children, cc = {}, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: SidebarHeadingSelectors;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    const { collapsed } = useSidebar();

    return <div {...props}
        role="heading"
        className={classes(
            style.heading,
            collapsed && style.collapsed,
            props.className
        )}>
        {children}
    </div>;
}

Heading.displayName = 'Sidebar.Heading';