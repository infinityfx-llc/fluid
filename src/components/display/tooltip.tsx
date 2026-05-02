'use client';

import { combineClasses, combineRefs, getAbsoluteZIndex } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { cloneElement, useState, useRef, useId, useEffect, Children } from "react";
import { createPortal } from "react-dom";
import { createStyles } from "../../core/style";

const TooltipData = {
    count: 0
};

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
        backgroundColor: 'var(--f-clr-grey-200)',
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
export default function Tooltip<T extends React.ReactElement<any>>({ children, cc = {}, content, position = 'auto', visibility = 'interact', delay = .3, ...props }:
    {
        children: T;
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
    const state = useRef({
        visible: false,
        touchOnly: false,
        timeout: undefined as any,
        maxWidth: undefined as number | undefined,
        offset: 0
    });

    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [computedPosition, setComputedPosition] = useState<string>(position);
    const [zIndex, setZIndex] = useState(0);

    // hide or show tooltip and update position if needed
    function toggle(value: boolean | null, delay = 0) {
        clearTimeout(state.current.timeout);
        if (value === null) return;

        if (element.current && tooltip.current && (value || visibility === 'always')) {
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
            if (['left', 'right'].includes(computedPosition)) {
                state.current.maxWidth = Math.max(left, right);
                state.current.offset = 0;
            } else {
                const l = left + width / 2;
                const r = window.innerWidth - l;

                state.current.maxWidth = undefined;
                state.current.offset = Math.max(tooltip.current.offsetWidth - Math.min(l, r) * 2, 0) * (l < r ? 1 : -1);
            }

            setComputedPosition(computedPosition);
            setZIndex(getAbsoluteZIndex(element.current) + 2);
        }

        if (!value || visibility === 'never') {
            state.current.touchOnly = false;

            const v = visibility === 'always';
            if (v !== state.current.visible) setTimeout(() => TooltipData.count += v ? 1 : -1, 200);

            return setVisible(state.current.visible = v);
        }

        state.current.timeout = setTimeout(() => {
            setVisible(true);

            if (!state.current.visible) TooltipData.count++;

            state.current.visible = true;
        }, TooltipData.count ? 0 : delay * 1000);
    }

    useEffect(() => {
        if (!mounted) setMounted(true);

        const el = element.current,
            ctrl = new AbortController(),
            signal = ctrl.signal;

        if (!el) return;

        let frame: any;

        // update tooltip position based on anchor position
        function update() {
            if (anchor.current && tooltip.current) {
                const { x, y } = anchor.current.getBoundingClientRect();
                const offset = {
                    top: '-50%, -100%',
                    left: '-100%, -50%',
                    right: '0%, -50%',
                    bottom: '-50%, 0%'
                }[computedPosition];
                const style = tooltip.current.style;

                style.transform = `translate(${x}px, ${y}px) translate(${offset})`;
                style.left = `${state.current.offset}px`;
                style.maxWidth = `${state.current.maxWidth}px`;
            }

            frame = requestAnimationFrame(update);
        }

        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(update); // call position update function every animation frame

        window.addEventListener('touchstart', (e: TouchEvent) => {
            if (e.target === el || el.contains(e.target as HTMLElement)) { // Needs more testing
                state.current.touchOnly = true;
                toggle(true, delay + .05);
            } else {
                toggle(false);
            }
        }, { signal });

        const show = (e: any) => {
            if (state.current.touchOnly ||
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
    }, [visibility, position, computedPosition, delay]);

    useEffect(() => toggle(visibility === 'always'), [visibility]);

    const childProps = typeof children === 'object' && 'props' in children ? children.props : {};

    return <>
        {cloneElement(children, {
            ...props,
            'aria-describedby': id,
            ref: combineRefs(element, props.ref, childProps.ref)
        })}

        {element.current && createPortal(<div ref={anchor} className={style.anchor} data-position={computedPosition} />, element.current)}

        {mounted && createPortal(<div ref={tooltip} id={id} role="tooltip" className={style.tooltip} aria-hidden={!visible} style={{ zIndex }}>
            {content}
        </div>, document.getElementById('__fluid') as HTMLElement)}
    </>;
}