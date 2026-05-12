'use client';

import { classes, combineRefs } from '../../../src/core/utils';
import { FluidBreakpoint } from '../../../src/types';
import { cloneElement, isValidElement } from 'react';
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

/**
 * Hides an element from the page for selected screen sizes.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/cull}
 */
export default function Cull<T extends React.ReactElement<any>>({ children, include, ref, ...props }: {
    children: T;
    include: FluidBreakpoint[];
    ref?: React.Ref<any>;
} & Omit<React.HTMLAttributes<any>, 'children'>) {

    if (!isValidElement(children)) return null;

    const childProps = typeof children === 'object' && 'props' in children ? children.props : {};

    return cloneElement(children, {
        ...props,
        ref: combineRefs(ref, childProps.ref),
        className: classes(...include.map(breakpoint => style[`cull__${breakpoint}`]), childProps.className)
    });
}