'use client';

import { classes } from '@/src/core/utils';
import useFluid from '@/src/hooks/use-fluid';
import useStyles from '@/src/hooks/use-styles';
import { FluidBreakpoint } from '@/src/types';
import { cloneElement, isValidElement } from 'react';

export default function Cull({ children, include }: { children: React.ReactNode; include: FluidBreakpoint[]; }) {
    const fluid = useFluid();

    const style = useStyles({
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
    if (!isValidElement(children)) return <>{children}</>;

    return cloneElement(children as React.ReactElement, {
        className: classes(...include.map(breakpoint => style[`cull__${breakpoint}`]), children.props.className)
    });
}