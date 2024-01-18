'use client';

import { forwardRef } from 'react';
import { FluidStyles, Selectors } from '../../../../src/types';
import { classes, combineClasses } from '../../../../src/core/utils';
import { createStyles } from '../../../core/style';
import { useSidebar } from './root';

const Heading = forwardRef(({ children, cc = {}, ...props }:
    {
        cc?: Selectors<'heading'>;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('sidebar.heading', {
        '.heading': {
            color: 'var(--f-clr-grey-500)',
            fontSize: 'var(--f-font-size-xsm)',
            fontWeight: 700,
            width: 'max-content',
            transition: 'opacity .3s',
            padding: '0 1em',
            marginTop: 'var(--f-spacing-med)'
        }
    });
    const style = combineClasses(styles, cc);
    const { collapsed } = useSidebar();

    return <div ref={ref} {...props} className={classes(style.heading, props.className)} style={{ ...props.style, opacity: collapsed ? 0 : 1 }}>{children}</div>;
});

Heading.displayName = 'Sidebar.Heading';

export default Heading;