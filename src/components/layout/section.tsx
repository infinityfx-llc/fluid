'use client';

import { classes } from '@/src/core/utils';
import useFluid from '@/src/hooks/use-fluid';
import useLayout from '@/src/hooks/use-layout';
import useStyles from '@/src/hooks/use-styles';
import { FluidSize, FluidStyles } from '@/src/types';
import { forwardRef } from 'react';

const Section = forwardRef(({ children, styles = {}, width, ...props }:
    {
        styles?: FluidStyles;
        width: FluidSize;
    } & React.HTMLAttributes<HTMLElement>, ref: React.ForwardedRef<HTMLElement>) => { // WIP (NOT PERFECT)
    const fluid = useFluid();
    const { header, sidebar, collapsed } = useLayout();

    const style = useStyles(styles, {
        '.section': {
            paddingLeft: `var(--f-page-${width})`,
            paddingRight: `var(--f-page-${width})`,
            paddingTop: header.current,
            display: 'flex',
            flexDirection: 'column',
            transition: 'padding-left .3s'
        },

        [`@media(min-width: ${fluid.breakpoints.tab + 1}px)`]: {
            '.section[data-sidebar="collapsed"]': {
                paddingLeft: `max(calc(5rem + var(--f-spacing-lrg)), var(--f-page-${width}))`
            },

            '.section[data-sidebar="expanded"]': {
                paddingLeft: `calc(${sidebar.current} + var(--f-spacing-lrg))`
            }
        }
    });

    return <section ref={ref} {...props} className={classes(style.section, props.className)} data-sidebar={sidebar.current && (collapsed ? 'collapsed' : 'expanded')}>
        {children}
    </section>;
});

Section.displayName = 'Section';

export default Section;