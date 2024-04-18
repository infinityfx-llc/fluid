'use client';

import { classes, combineClasses, combineRefs } from '../../../src/core/utils';
import { FluidBreakpoint, Selectors } from '../../../src/types';
import { cloneElement, forwardRef } from 'react';
import { createStyles } from '../../core/style';

const Cull = forwardRef(({ children, cc = {}, include, ...props }: {
    children: React.ReactElement;
    cc?: Selectors;
    include: FluidBreakpoint[];
} & Omit<React.HTMLAttributes<any>, 'children'>, ref: React.ForwardedRef<any>) => {
    const styles = createStyles('cull', (fluid) => ({
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
    const style = combineClasses(styles, cc);

    children = Array.isArray(children) ? children[0] : children;

    return cloneElement(children as React.ReactElement, {
        ...props,
        ref: combineRefs(ref, (children as any).ref),
        className: classes(...include.map(breakpoint => style[`cull__${breakpoint}`]), children.props.className)
    });
});

Cull.displayName = 'Cull';

export default Cull;