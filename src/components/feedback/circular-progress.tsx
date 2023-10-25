'use client';

import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, FluidStyles, Selectors } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { useLink } from "@infinityfx/lively/hooks";
import { forwardRef, useEffect } from "react";
import { createStyles } from "../../core/style";

export type CircularProgressStyles = FluidStyles<'.wrapper' | '.track' | '.progress' | '.wrapper__xsm' | '.wrapper__sml' | '.wrapper__med' | '.wrapper__lrg'>;

const CircularProgress = forwardRef(({ children, cc = {}, size = 'med', slice = 0, value, defaultValue = 0, color, ...props }:
    {
        cc?: Selectors<'wrapper' | 'track' | 'progress' | 'wrapper__xsm' | 'wrapper__sml' | 'wrapper__med' | 'wrapper__lrg'>;
        size?: FluidSize;
        slice?: number;
        value?: number;
        defaultValue?: number;
        color?: string;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('circular-progress', {
        '.wrapper': {
            width: '3.2em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },

        '.track': {
            stroke: 'var(--f-clr-fg-100)',
            strokeWidth: '10px',
            strokeLinecap: 'round',
            strokeDasharray: 1
        },

        '.progress': {
            stroke: 'var(--f-clr-primary-100)',
            strokeWidth: '10px',
            strokeLinecap: 'round',
            transition: 'background-color .3s'
        },

        '.label': {
            position: 'absolute',
            fontSize: '0.7em',
            fontWeight: 600
        },

        '.wrapper__xsm': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.wrapper__sml': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.wrapper__med': {
            fontSize: 'var(--f-font-size-med)'
        },

        '.wrapper__lrg': {
            fontSize: 'var(--f-font-size-lrg)'
        }
    });
    const style = combineClasses(styles, cc);

    const state = value !== undefined ? value : defaultValue;
    const link = useLink(state);

    useEffect(() => link.set(state * (1 - slice), .3), [state, slice]);

    return <div ref={ref} {...props} className={classes(
        style.wrapper,
        style[`wrapper__${size}`],
        props.className
    )}>
        <div className={style.label}>
            {children}
        </div>

        <svg viewBox="0 0 100 100" role="progressbar" aria-valuenow={state * 100} style={{ rotate: `${90 + 180 * slice}deg`, width: '100%' }}>
            <circle r={45} cx={50} cy={50} fill="none" className={style.track} pathLength={1} style={{ strokeDashoffset: slice }} />

            <Animatable animate={{ strokeLength: link }} initial={{ strokeDashoffset: 1 - (link() * (1 - slice)) }}>
                <circle r={45} cx={50} cy={50} fill="none" className={style.progress} style={{ stroke: color }} />
            </Animatable>
        </svg>
    </div>;
});

CircularProgress.displayName = 'CircularProgress';

export default CircularProgress;