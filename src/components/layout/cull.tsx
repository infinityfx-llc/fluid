'use client';

import { classes, combineRefs } from '../../../src/core/utils';
import useFluid from '../../../src/hooks/use-fluid';
import useStyles from '../../../src/hooks/use-styles';
import { FluidBreakpoint, FluidStyles } from '../../../src/types';
import { cloneElement, forwardRef } from 'react';

const Cull = forwardRef(({ children, styles = {}, include, ...props }: { children: React.ReactElement; styles?: FluidStyles; include: FluidBreakpoint[]; } & React.HTMLAttributes<any>, ref: React.ForwardedRef<any>) => {
    const fluid = useFluid();

    const style = useStyles(styles, {
        [`@media (max-width: ${fluid.breakpoints.mob}px)`]: {
            '.cull__mob': {
                display: 'none !important'
            }
        },
        [`@media (min-width: ${fluid.breakpoints.mob + 1}px) and (max-width: ${fluid.breakpoints.tab}px)`]: {
            '.cull__tab': {
                display: 'none !important'
            }
        },
        [`@media (min-width: ${fluid.breakpoints.tab + 1}px) and (max-width: ${fluid.breakpoints.lap}px)`]: {
            '.cull__lap': {
                display: 'none !important'
            }
        },
        [`@media (min-width: ${fluid.breakpoints.lap + 1}px)`]: {
            '.cull__dsk': {
                display: 'none !important'
            }
        }
    });

    children = Array.isArray(children) ? children[0] : children;

    return cloneElement(children as React.ReactElement, {
        ...props,
        ref: combineRefs(ref, (children as any).ref),
        className: classes(...include.map(breakpoint => style[`cull__${breakpoint}`]), children.props.className)
    });
});

Cull.displayName = 'Cull';

export default Cull;