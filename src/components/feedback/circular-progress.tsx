'use client';

import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, Selectors } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { useLink } from "@infinityfx/lively/hooks";
import { useEffect } from "react";
import { createStyles } from "../../core/style";

const styles = createStyles('circular-progress', {
    '.wrapper': {
        position: 'relative',
        width: '3.2em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    },

    '.track': {
        stroke: 'var(--f-clr-fg-100)',
        strokeWidth: '10px',
        strokeLinecap: 'round',
        strokeDasharray: 1
    },

    '.progress': {
        stroke: 'var(--color, var(--f-clr-primary-100))',
        strokeWidth: '10px',
        strokeLinecap: 'round',
        transition: 'background-color .3s'
    },

    '.label': {
        position: 'absolute',
        fontSize: '0.7em',
        fontWeight: 600
    },

    '.s__xsm': {
        fontSize: 'var(--f-font-size-xsm)'
    },

    '.s__sml': {
        fontSize: 'var(--f-font-size-sml)'
    },

    '.s__med': {
        fontSize: 'var(--f-font-size-med)'
    },

    '.s__lrg': {
        fontSize: 'var(--f-font-size-lrg)'
    }
});

export type CircularProgressSelectors = Selectors<'wrapper' | 'track' | 'progress' | 's__xsm' | 's__sml' | 's__med' | 's__lrg'>;

/**
 * A circular indicator displaying the progress of something.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/circular-progress}
 */
export default function CircularProgress({ children, cc = {}, size = 'med', slice = 0, value, defaultValue = 0, color, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: CircularProgressSelectors;
        size?: FluidSize;
        slice?: number;
        value?: number;
        defaultValue?: number;
        color?: string;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'>) {
    const style = combineClasses(styles, cc);

    const state = value !== undefined ? value : defaultValue;
    const link = useLink(state * (1 - slice));

    useEffect(() => link.set(state * (1 - slice), { duration: .3 }), [state, slice]);

    return <div
        {...props}
        aria-label={undefined}
        className={classes(
            style.wrapper,
            style[`s__${size}`],
            props.className
        )}>
        <div className={style.label}>
            {children}
        </div>

        <svg viewBox="0 0 100 100" role="progressbar" aria-valuenow={state * 100} aria-label={props["aria-label"]} style={{ rotate: `${90 + 180 * slice}deg`, width: '100%' }}>
            <circle r={45} cx={50} cy={50} fill="none" className={style.track} pathLength={1} style={{ strokeDashoffset: slice }} />

            <Animatable animate={{ strokeLength: link }} initial={{ strokeDashoffset: 1 - link() }}>
                <circle r={45} cx={50} cy={50} fill="none" className={style.progress} style={{ '--color': color } as any} />
            </Animatable>
        </svg>
    </div>;
}