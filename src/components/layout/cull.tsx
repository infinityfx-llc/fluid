'use client';

import { classes } from '@/src/core/utils';
import useFluid from '@/src/hooks/use-fluid';
import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { cloneElement, isValidElement } from 'react';

const Breakpoints = {
    mob: 0,
    tab: 1,
    lap: 2,
    dsk: 3
}

export default function Cull({ children, include }: { children: React.ReactNode; include: ('mob' | 'tab' | 'lap' | 'dsk')[]; }) {
    const fluid = useFluid();

    const styles: FluidStyles = {};
    const queries = include.map(val => {
        const idx = Breakpoints[val];

        const min = idx !== 0 ? fluid.breakpoints[idx - 1] + 1 : null;
        const max = idx !== 3 ? fluid.breakpoints[idx] : null;

        return [min, max]
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

    const style = useStyles(styles);

    children = Array.isArray(children) ? children[0] : children;
    if (!isValidElement(children)) return <>{children}</>;

    return cloneElement(children as React.ReactElement, {
        className: classes(style.cull, children.props.className)
    });
}