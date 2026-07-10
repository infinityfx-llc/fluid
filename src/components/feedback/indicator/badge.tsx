'use client';

import { classes, combineClasses, combineRefs } from "../../../../src/core/utils";
import { Selectors } from "../../../../src/types";
import { useLayoutEffect, useRef, useState } from "react";
import { createStyles } from "../../../core/style";

const styles = createStyles('indicator-badge', {
    '.badge': {
        position: 'absolute',
        minWidth: '1.5em',
        minHeight: '1.5em',
        lineHeight: 1,
        borderRadius: '99px',
        backgroundColor: 'var(--f-clr-accent-100)',
        border: 'solid 2px transparent',
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

export type IndicatorBadgeSelectors = Selectors<'badge'>;

export default function Badge({ children, cc = {}, color, outline, position = 'top', ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: IndicatorBadgeSelectors;
        color?: string;
        /**
         * The color of outline around the indicator.
         * 
         * Ideally this should be the same color as the background.
         * 
         * @default "none"
         */
        outline?: string;
        position?: 'top' | 'bottom';
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);
    const badge = useRef<HTMLDivElement>(null);
    const [radius, setRadius] = useState(0);

    useLayoutEffect(() => {
        if (!badge.current) return;

        const parent = badge.current.offsetParent;
        const el = parent && parent.querySelector(':not([data-indicator-badge])');
        if (!(el instanceof HTMLElement)) return;

        // get corner radius from target element
        const radius = parseFloat(getComputedStyle(el)[position === 'top' ? 'borderTopRightRadius' : 'borderBottomRightRadius']) || 0;
        const max = Math.min(el.offsetWidth, el.offsetHeight) / 2;

        setRadius(Math.min(radius, max));
    }, [children]);

    // calculate where to display indicator based on target element corner radius
    const offset = Math.max(Math.SQRT2 * radius - radius, 0);

    return <div
        {...props}
        data-indicator-badge
        ref={combineRefs(props.ref, badge)}
        className={classes(
            style.badge,
            props.className
        )}
        style={{
            ...props.style,
            backgroundColor: color,
            borderColor: outline,
            [position]: offset,
            right: offset,
            translate: position === 'top' ? '60% -60%' : '60% 60%'
        }}>
        {children}
    </div>;
}