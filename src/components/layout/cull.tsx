'use client';

import { classes, combineRefs } from '../../../src/core/utils';
import { FluidBreakpoint } from '../../../src/types';
import { cloneElement, forwardRef } from 'react';
import { createStyles } from '../../core/style';

const style = createStyles('cull', fluid => ({
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
}));

const Cull = forwardRef(({ children, include, ...props }: {
    children: React.ReactElement;
    include: FluidBreakpoint[];
} & Omit<React.HTMLAttributes<any>, 'children'>, ref: React.ForwardedRef<any>) => {

    children = Array.isArray(children) ? children[0] : children;

    return cloneElement(children as React.ReactElement, {
        ...props,
        ref: combineRefs(ref, (children as any).ref),
        className: classes(...include.map(breakpoint => style[`cull__${breakpoint}`]), children.props.className)
    });
});

Cull.displayName = 'Cull';

export default Cull;