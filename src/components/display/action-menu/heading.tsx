'use client';

import { forwardRef } from 'react';
import { Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { classes, combineClasses } from '../../../core/utils';

const styles = createStyles('action-menu.heading', {
    '.heading': {
        padding: '.4rem .8rem .4rem .8rem',
        fontWeight: 800,
        fontSize: '.7em',
        color: 'var(--f-clr-grey-500)'
    }
});

export type ActionMenuHeadingSelectors = Selectors<'option'>;

const Heading = forwardRef(({ children, cc = {}, className, ...props }:
    {
        cc?: ActionMenuHeadingSelectors;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = combineClasses(styles, cc);

    return <div ref={ref} {...props} className={classes(style.heading, className)}>
        {children}
    </div>;
});

Heading.displayName = 'ActionMenu.Heading';

export default Heading;