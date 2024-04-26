'use client';

import { forwardRef } from 'react';
import { FluidInputvalue, FluidStyles, Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { classes, combineClasses } from '../../../core/utils';

export type ComboboxOptionStyles = FluidStyles<'option'>;

const Heading = forwardRef(({ children, cc = {}, className, ...props }:
    {
        cc?: Selectors;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('action-menu.heading', {
        '.heading': {
            padding: '.5rem .8rem .2rem .8rem',
            fontWeight: 800,
            fontSize: '.75em',
            color: 'var(--f-clr-grey-600)'
        }
    });
    const style = combineClasses(styles, cc);

    return <div ref={ref} {...props} className={classes(style.heading, className)}>
        {children}
    </div>;
});

Heading.displayName = 'ActionMenu.Heading';

export default Heading;