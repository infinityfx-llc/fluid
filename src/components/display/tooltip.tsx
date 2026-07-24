'use client';

import { classes, combineClasses, combineRefs, getAbsoluteZIndex } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { cloneElement, useState, useRef, useId, useEffect } from "react";
import { createPortal } from "react-dom";
import { createStyles } from "../../core/style";

const TooltipData = {
    count: 0
};

const styles = createStyles('tooltip', {
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

    '.v__inverted': {
        backgroundColor: 'var(--f-clr-grey-900)',
        color: 'var(--f-clr-text-200)'
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
export default function Tooltip<T extends React.ReactElement<any>>({ children, cc = {}, content, position = 'auto', visibility = 'interact', variant = 'default', delay = .3, ...props }:
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
        variant?: 'default' | 'inverted';
        /**
         * Delay in seconds before tooltip shows after interaction.
         * 
         * @default .3
         */
        delay?: number;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'content'>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const tooltip = useRef<HTMLDivElement | null>(null);
    const element = useRef<HTMLElement | null>(null);
    const state = useRef({
        visible: false,
        touchOnly: false,
        timeout: undefined as any,
        lastComputedPosition: undefined as 'top' | 'left' | 'bottom' | 'right' | undefined
    });

    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [zIndex, setZIndex] = useState(0);

    // hide or show tooltip and update position if needed
    function toggle(value: boolean | null, delay = 0) {
        clearTimeout(state.current.timeout);
        if (value === null) return;

        if (element.current && (value || visibility === 'always')) setZIndex(getAbsoluteZIndex(element.current) + 2);

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
            // dont update if not visible?

            if (element.current && tooltip.current) {
                const { x, y, right, bottom, width, height } = element.current.getBoundingClientRect();
                const xhat = window.innerWidth - right;
                const yhat = window.innerHeight - bottom;

                // if position == 'auto' calculate best position based on the available space
                const computed = position !== 'auto' ? position : ({
                    [x]: 'left',
                    [y]: 'top',
                    [xhat]: 'right',
                    [yhat]: 'bottom'
                } as const)[Math.max(x, y, xhat, yhat)];

                // get translation offset based on computed position
                const [tx, ty, offset] = ({
                    top: [x + width / 2, y, '-50%, calc(-100% - var(--f-spacing-sml))'],
                    left: [x, y + height / 2, 'calc(-100% - var(--f-spacing-sml)), -50%'],
                    right: [x + width, y + height / 2, 'var(--f-spacing-sml), -50%'],
                    bottom: [x + width / 2, y + height, '-50%, var(--f-spacing-sml)']
                } as const)[computed];

                const style = tooltip.current.style;
                style.transform = `translate(${tx}px, ${ty}px) translate(${offset})`;

                if (state.current.lastComputedPosition !== computed) {
                    // calculate the maximum width based on the available space and position
                    if (['left', 'right'].includes(computed)) {
                        style.maxWidth = `${Math.max(x, xhat)}px`;
                        style.left = '0px';
                    } else {
                        const l = x + width / 2;
                        const r = window.innerWidth - l;

                        style.maxWidth = '';
                        style.left = `${Math.max(tooltip.current.offsetWidth - Math.min(l, r) * 2, 0) * (l < r ? 1 : -1)}px`;
                    }

                    state.current.lastComputedPosition = computed;
                }
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
    }, [visibility, position, delay]);

    useEffect(() => toggle(visibility === 'always'), [visibility]);

    // todo: if children changes to null whilst render
    // tooltip is not visible on subsequent re-renders

    return <>
        {cloneElement(children, {
            ...props,
            'aria-describedby': id,
            ref: combineRefs(element, props.ref, children?.props?.ref)
        })}

        {mounted && createPortal(<div
            ref={tooltip}
            id={id}
            role="tooltip"
            className={classes(
                style.tooltip,
                style[`v__${variant}`]
            )}
            aria-hidden={!visible}
            style={{ zIndex }}>
            {content}
        </div>, document.getElementById('__fluid') as HTMLElement)}
    </>
}