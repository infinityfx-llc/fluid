'use client';

import { classes, combineClasses, combineRefs } from "../../../src/core/utils";
import { FluidSize, Selectors } from "../../../src/types";
import { useLayoutEffect, useRef } from "react";
import { createStyles } from "../../core/style";

const styles = createStyles('circular-progress', {
    '.wrapper': {
        position: 'relative',
        minWidth: 'min(100vw, 3.6em)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    '.track, .progress': {
        fill: 'none',
        strokeDasharray: 1,
        strokeWidth: 'calc(.45em * var(--scale, 1))',
        strokeLinecap: 'round',
        transformOrigin: 'center',
        transition: 'background-color .3s, stroke-dashoffset .3s, rotate .3s'
    },

    '.track': {
        stroke: 'var(--f-clr-fg-100)'
    },

    '.progress': {
        stroke: 'var(--color, var(--f-clr-primary-100))'
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
export default function CircularProgress({ children, cc = {}, size = 'med', slice = 0, value = 0, color, gap = 0, fixedStrokeWidth = true, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: CircularProgressSelectors;
        size?: FluidSize;
        slice?: number;
        value?: number;
        color?: string;
        gap?: number;
        fixedStrokeWidth?: boolean;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);
    const el = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!fixedStrokeWidth) return;

        function resize() {
            if (!el.current) return;

            const { width, fontSize } = getComputedStyle(el.current);
            el.current.style.setProperty('--scale', (3.6 * parseFloat(fontSize)) / parseFloat(width) + '');
        }

        const observer = new ResizeObserver(resize);
        if (el.current) observer.observe(el.current);

        return () => observer.disconnect();
    }, []);

    return <div
        {...props}
        ref={combineRefs(props.ref, el)}
        aria-label={undefined}
        className={classes(
            style.wrapper,
            style[`s__${size}`],
            props.className
        )}>
        <div className={style.label}>
            {children}
        </div>

        <svg
            overflow="visible"
            viewBox="0 0 100 100"
            role="progressbar"
            aria-valuenow={value * 100}
            aria-label={props["aria-label"]}
            style={{
                rotate: `${90 + 180 * slice}deg`,
                '--color': color
            } as any}>
            <circle r={45} cx={50} cy={50}
                pathLength={1}
                className={style.track}
                style={{
                    strokeDashoffset: value ? Math.min(value * (1 - slice) + Math.max(slice, gap / 2) + gap / 2, 1) : slice,
                    rotate: `${value ? Math.min(value * (1 - slice) + gap / 2, 1 - slice) * 360 : 0}deg`
                }} />

            <circle r={45} cx={50} cy={50}
                pathLength={1}
                className={style.progress}
                style={{
                    strokeDashoffset: value < 1 ? Math.min(1 - value * (1 - slice) + Math.max(gap / 2 - slice, 0) + gap / 2, 1) : slice,
                    rotate: `${value < 1 ? Math.max(gap / 2 - slice, 0) * 360 : 0}deg`
                }} />
        </svg>
    </div>;
}