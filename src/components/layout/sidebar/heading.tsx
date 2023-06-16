import { forwardRef } from 'react';
import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { classes } from '@/src/core/utils';

const SidebarHeading = forwardRef(({ children, styles = {}, ...props }:
    {
        styles?: FluidStyles;
    } & React.ButtonHTMLAttributes<HTMLHeadingElement>, ref: React.ForwardedRef<HTMLHeadingElement>) => {
    const style = useStyles(styles, {
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

    return <h3 ref={ref} {...props} className={classes(style.heading, props.className)}>{children}</h3>;
});

SidebarHeading.displayName = 'SidebarHeading';

export default SidebarHeading;