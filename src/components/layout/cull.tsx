'use client';

import { classes } from '@/src/core/utils';
import useFluid from '@/src/hooks/use-fluid';
import useStyles from '@/src/hooks/use-styles';
import { FluidBreakpoint, FluidStyles } from '@/src/types';
import { cloneElement, isValidElement, useMemo } from 'react';

const MinBreakpoints: {
    [key in FluidBreakpoint]: FluidBreakpoint | null;
} = {
    mob: null,
    tab: 'mob',
    lap: 'tab',
    dsk: 'lap'
};

export default function Cull({ children, include }: { children: React.ReactNode; include: FluidBreakpoint[]; }) {
    const fluid = useFluid();

    const style = useMemo(() => {
        const styles: FluidStyles = {};
        const queries = include.map(val => {
            const min = MinBreakpoints[val];

            return [
                min && fluid.breakpoints[min],
                val !== 'dsk' ? fluid.breakpoints[val] : null
            ]
                .map((val, i) => {
                    return val !== null ? `(${['min', 'max'][i]}-width: ${val}px)` : null;
                })
                .filter(val => val)
                .join(' and ');
        });

        for (const query of queries) styles[`@media ${query}`] = {
            '.cull': {
                display: 'none !important'
            }
        };

        return useStyles(styles);
    }, [include]);

    children = Array.isArray(children) ? children[0] : children;
    if (!isValidElement(children)) return <>{children}</>;

    return cloneElement(children as React.ReactElement, {
        className: classes(style.cull, children.props.className)
    });
}