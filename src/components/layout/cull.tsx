'use client';

import { classes, combineRefs } from '../../../src/core/utils';
import { FluidBreakpoint } from '../../../src/types';
import { cloneElement } from 'react';
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

export default function Cull({ children, include, ref, ...props }: {
    children: React.ReactElement<any>;
    include: FluidBreakpoint[];
    ref?: React.Ref<any>;
} & Omit<React.HTMLAttributes<any>, 'children'>) {

    children = Array.isArray(children) ? children[0] : children;

    return cloneElement(children, {
        ...props,
        ref: combineRefs(ref, (children as any).ref),
        className: classes(...include.map(breakpoint => style[`cull__${breakpoint}`]), children.props.className)
    });
}