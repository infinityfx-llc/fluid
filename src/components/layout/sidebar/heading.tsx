'use client';

import { forwardRef } from 'react';
import { FluidStyles, Selectors } from '../../../../src/types';
import { classes, combineClasses } from '../../../../src/core/utils';
import { createStyles } from '../../../core/style';

const Heading = forwardRef(({ children, cc = {}, ...props }:
    {
        cc?: Selectors<'heading'>;
    } & React.ButtonHTMLAttributes<HTMLHeadingElement>, ref: React.ForwardedRef<HTMLHeadingElement>) => {
    const styles = createStyles('sidebar.heading', {
        '.heading': {
            color: 'var(--f-clr-grey-500)',
            fontSize: 'var(--f-font-size-xsm)',
            width: 'max-content',
            transition: 'opacity .3s',
            padding: '0 1em',
            marginTop: 'var(--f-spacing-med)'
        },

        'aside[data-collapsed="true"] .heading': {
            opacity: 0
        }
    });
    const style = combineClasses(styles, cc);

    return <h3 ref={ref} {...props} className={classes(style.heading, props.className)}>{children}</h3>;
});

Heading.displayName = 'Heading';

export default Heading;