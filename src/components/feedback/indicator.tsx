'use client';

import { classes, combineClasses, combineRefs } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { cloneElement, isValidElement, useEffect, useRef, useState } from "react";
import { createStyles } from "../../core/style";
import { createPortal } from "react-dom";

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
 * @see {@link https://fluid.infinityfx.dev/docs/components/halo}
 */
export default function Indicator<T extends React.ReactElement<any>>({ children, cc = {}, content, color, outline, ref, ...props }:
    {
        children: T;
        ref?: React.Ref<any>;
        cc?: IndicatorSelectors;
        content?: number | string | boolean;
        color?: string;
        outline?: string;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'content'>) {
    const style = combineClasses(styles, cc);
    const container = useRef<any>(undefined);
    const [radius, setRadius] = useState(-1);

    useEffect(() => {
        if (container.current instanceof HTMLElement) {
            // get corner radius from target element
            const radius = parseFloat(getComputedStyle(container.current).borderTopRightRadius) || 0;
            const max = Math.min(container.current.offsetWidth, container.current.offsetHeight) / 2;

            setRadius(Math.min(radius, max));
        }
    }, []);

    children = Array.isArray(children) ? children[0] : children;
    if (!isValidElement(children)) return children;

    // calculate where to display indicator based on target element corner radius
    const offset = Math.max(Math.SQRT2 * radius - radius - 1, 0);

    return <>
        {cloneElement(children, {
            ref: combineRefs(ref, children.props.ref, container)
        })}

        {radius >= 0 && content !== false && createPortal(<div {...props}
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
        </div>, container.current)}
    </>;
}