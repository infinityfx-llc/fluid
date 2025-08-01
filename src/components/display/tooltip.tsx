'use client';

import { combineClasses, combineRefs } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { cloneElement, useState, useRef, isValidElement, useId, useEffect } from "react";
import { createPortal } from "react-dom";
import { createStyles } from "../../core/style";

const styles = createStyles('tooltip', {
    '.anchor': {
        position: 'absolute',
        pointerEvents: 'none'
    },

    '.anchor[data-position="top"]': {
        bottom: 'calc(100% + var(--f-spacing-sml))',
        left: '50%'
    },

    '.anchor[data-position="left"]': {
        right: 'calc(100% + var(--f-spacing-sml))',
        top: '50%'
    },

    '.anchor[data-position="right"]': {
        left: 'calc(100% + var(--f-spacing-sml))',
        top: '50%'
    },

    '.anchor[data-position="bottom"]': {
        top: 'calc(100% + var(--f-spacing-sml))',
        left: '50%'
    },

    '.tooltip': {
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 999,
        backgroundColor: 'var(--f-clr-fg-200)',
        color: 'var(--f-clr-text-100)',
        fontSize: 'var(--f-font-size-xsm)',
        fontWeight: 600,
        textAlign: 'center',
        padding: '.3em .5em',
        borderRadius: 'var(--f-radius-sml)',
        pointerEvents: 'none',
        transition: 'opacity .2s, translate .2s'
    },

    '.tooltip[aria-hidden="true"]': {
        opacity: 0,
        translate: '0px 4px'
    }
});

export type TooltipSelectors = Selectors<'tooltip'>;

/**
 * Displays an information popup next to an element when that element is hovered or receives focus.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/tooltip}
 */
export default function Tooltip({ children, cc = {}, content, position = 'auto', visibility = 'interact', delay = .3, ...props }:
    {
        children: React.ReactElement<any>;
        ref?: React.Ref<HTMLDivElement>;
        cc?: TooltipSelectors;
        content?: React.ReactNode;
        /**
         * @default "auto"
         */
        position?: 'auto' | 'top' | 'left' | 'bottom' | 'right';
        /**
         * @default "interact"
         */
        visibility?: 'never' | 'interact' | 'always';
        delay?: number;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'content'>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const anchor = useRef<HTMLDivElement | null>(null);
    const tooltip = useRef<HTMLDivElement | null>(null);
    const element = useRef<HTMLElement | null>(null);
    const timeout = useRef<any>(undefined);
    const touchOnly = useRef(false);

    const [visible, setVisible] = useState(false);
    const [computedPosition, setComputedPosition] = useState<string>(position);
    const [maxWidth, setMaxWidth] = useState('100vw');
    const renderedPosition = position === 'auto' ? computedPosition : position;

    // hide or show tooltip and update position if needed
    function toggle(value: boolean | null, delay = 0) {
        clearTimeout(timeout.current);
        if (value === null) return;

        if (element.current) {
            let { left, top, right, bottom, width } = element.current.getBoundingClientRect();
            right = window.innerWidth - right;
            bottom = window.innerHeight - bottom;

            // if position == 'auto' calculate best position based on the available space
            const computedPosition = position !== 'auto' ? position : {
                [left]: 'left',
                [top]: 'top',
                [right]: 'right',
                [bottom]: 'bottom'
            }[Math.max(left, top, right, bottom)];

            // calculate the maximum width based on the available space and position
            let maxWidth = left + width / 2;
            switch (computedPosition) {
                case 'left': maxWidth = left;
                    break;
                case 'right': maxWidth = right;
                    break;
                default: maxWidth = Math.min(window.innerWidth - maxWidth, maxWidth) * 2;
            }

            setMaxWidth(`calc(${maxWidth}px - var(--f-spacing-sml) * 2)`);
            setComputedPosition(computedPosition);
        }

        if (!value || visibility === 'never') {
            touchOnly.current = false;
            return setVisible(visibility === 'always');
        }

        timeout.current = setTimeout(() => {
            setVisible(true);
        }, delay * 1000);
    }

    let frame: number;

    // update tooltip position based on anchor position
    function update() {
        if (anchor.current && tooltip.current) {
            const { x, y } = anchor.current.getBoundingClientRect();
            const offset = {
                top: '-50%, -100%',
                left: '-100%, -50%',
                right: '0%, -50%',
                bottom: '-50%, 0%'
            }[renderedPosition];

            tooltip.current.style.transform = `translate(${x}px, ${y}px) translate(${offset})`;
        }

        frame = requestAnimationFrame(update);
    }

    useEffect(() => {
        const el = element.current,
            ctrl = new AbortController(),
            signal = ctrl.signal;

        if (!el) return;

        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(update); // call position update function every animation frame

        window.addEventListener('touchstart', (e: TouchEvent) => {
            if (e.target === el || el.contains(e.target as HTMLElement)) { // Needs more testing
                touchOnly.current = true;
                toggle(true, delay + .05);
            } else {
                toggle(false);
            }
        }, { signal });

        const show = (e: any) => {
            if (touchOnly.current ||
                (e instanceof FocusEvent &&
                    e.target instanceof Element &&
                    !e.target.matches(':focus-visible'))) return;

            toggle(true, delay);
        }

        el.addEventListener('mouseenter', show, { signal });
        el.addEventListener('focus', show, { signal });
        el.addEventListener('mouseleave', () => toggle(false), { signal });
        el.addEventListener('blur', () => toggle(false), { signal });
        el.addEventListener('touchend', () => toggle(null), { signal });

        return () => {
            cancelAnimationFrame(frame);
            ctrl.abort();
        }
    }, [visibility, renderedPosition, delay]);

    useEffect(() => toggle(visibility === 'always'), [visibility]);

    children = Array.isArray(children) ? children[0] : children;
    if (!isValidElement(children)) return children;

    return <>
        {cloneElement(children, {
            ...props,
            'aria-describedby': id,
            ref: combineRefs(element, props.ref, children.props.ref)
        })}

        {element.current && createPortal(<div ref={anchor} className={style.anchor} data-position={renderedPosition} />, element.current)}

        {element.current && createPortal(<div ref={tooltip} id={id} role="tooltip" className={style.tooltip} aria-hidden={!visible} style={{ maxWidth }}>
            {content}
        </div>, document.getElementById('__fluid') as HTMLElement)}
    </>;
}