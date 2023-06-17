'use client';

import { classes } from '@/src/core/utils';
import useFluid from '@/src/hooks/use-fluid';
import useStyles from '@/src/hooks/use-styles';
import { FluidSize, FluidStyles } from '@/src/types';
import { forwardRef } from 'react';

const Section = forwardRef(({ children, styles = {}, width, landing = false, header, sidebar, collapsed, ...props }:
    {
        styles?: FluidStyles;
        width: FluidSize;
        landing?: boolean;
        header?: boolean | FluidSize;
        sidebar?: boolean;
        collapsed?: boolean;
    } & React.HTMLAttributes<HTMLElement>, ref: React.ForwardedRef<HTMLElement>) => {
    const fluid = useFluid();

    const style = useStyles(styles, {
        '.section': {
            paddingLeft: `var(--f-page-${width})`,
            paddingRight: `var(--f-page-${width})`,
            display: 'flex',
            flexDirection: 'column',
            transition: 'padding-left .3s'
        },

        '.section[data-landing="true"]': {
            minHeight: '100dvh',
            paddingTop: header ? `var(--f-header-${header})` : undefined,
        },

        [`@media(min-width: ${fluid.breakpoints[1] + 1}px)`]: {
            '.section[data-sidebar="collapsed"]': {
                paddingLeft: `max(calc(5rem + var(--f-spacing-lrg)), var(--f-page-${width}))`
            },

            '.section[data-sidebar="true"]': {
                paddingLeft: `calc(var(--f-sidebar) + var(--f-spacing-lrg))`
            }
        }
    });

    return <section ref={ref} {...props} className={classes(style.section, props.className)} data-landing={landing} data-sidebar={(sidebar && collapsed) ? 'collapsed' : sidebar}>
        {children}
    </section>;
});

Section.displayName = 'Section';

export default Section;