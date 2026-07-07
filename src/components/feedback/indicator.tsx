'use client';

import { classes, combineClasses, combineRefs } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { useLayoutEffect, useRef, useState } from "react";
import { createStyles } from "../../core/style";

const styles = createStyles('indicator', {
    '.indicator': {
        position: 'absolute',
        minWidth: '1.5em',
        minHeight: '1.5em',
        lineHeight: 1,
        borderRadius: '99px',
        backgroundColor: 'var(--f-clr-accent-100)',
        border: 'solid 2px transparent',
        translate: '50% -50%',
        pointerEvents: 'none',
        fontSize: 'var(--f-font-size-xxs)',
        fontWeight: 600,
        color: 'var(--f-clr-text-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '.1em .3em',
        zIndex: 99,
        WebkitBackfaceVisibility: 'hidden'
    }
});

export type IndicatorSelectors = Selectors<'indicator'>;

/**
 * Displays an activity indicator at the corner of an element.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/indicator}
 */
export default function Indicator({ cc = {}, content, color, outline, ref, ...props }:
    {
        ref?: React.Ref<any>;
        cc?: IndicatorSelectors;
        content?: number | string | boolean;
        color?: string;
        /**
         * The color of outline around the indicator.
         * 
         * Ideally this should be the same color as the background.
         * 
         * @default "none"
         */
        outline?: string;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'content'>) {
    const style = combineClasses(styles, cc);
    const indicator = useRef<HTMLDivElement>(null);
    const [radius, setRadius] = useState(0);

    useLayoutEffect(() => {
        if (indicator.current) {
            const parent = indicator.current.offsetParent;
            if (!(parent instanceof HTMLElement)) return;

            // get corner radius from target element
            const radius = parseFloat(getComputedStyle(parent).borderTopRightRadius) || 0;
            const max = Math.min(parent.offsetWidth, parent.offsetHeight) / 2;

            setRadius(Math.min(radius, max));
        }
    }, [content]);

    // calculate where to display indicator based on target element corner radius
    const offset = Math.max(Math.SQRT2 * radius - radius - 1, 0);

    if (content === false) return null;

    return <div
        {...props}
        ref={combineRefs(ref, indicator)}
        key="indicator"
        className={classes(
            style.indicator,
            props.className
        )}
        style={{
            ...props.style,
            backgroundColor: color,
            borderColor: outline,
            top: offset,
            right: offset
        }}>
        {typeof content !== 'boolean' ? content : null}
    </div>;
}