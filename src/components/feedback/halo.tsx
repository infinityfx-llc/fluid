'use client';

import { classes, combineClasses, combineRefs } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { Animate } from "@infinityfx/lively";
import { useLink } from "@infinityfx/lively/hooks";
import { useRef, useEffect, useState } from "react";
import { createStyles } from "../../core/style";

const styles = createStyles('halo', {
    '.target': {
        isolation: 'isolate'
    },

    '.halo': {
        position: 'absolute',
        overflow: 'hidden',
        borderRadius: 'inherit',
        inset: 0,
        minWidth: '100%',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: -1
    },

    '.ripple': {
        minWidth: '280%',
        minHeight: '280%',
        aspectRatio: 1,
        backgroundColor: 'var(--f-clr-grey-500)',
        borderRadius: '9999px',
        zIndex: -1
    }
});

export type HaloSelectors = Selectors<'halo' | 'ripple'>;

/**
 * Displays a translucent overlay when an element is hovered over or has focus.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/halo}
 */
export default function Halo<P extends HTMLElement>({ children, cc = {}, color, hover = true, disabled = false, target, ref, ...props }:
    {
        ref?: React.Ref<any>;
        cc?: HaloSelectors;
        color?: string;
        /**
         * Show the Halo when hovering over the target.
         * 
         * @default true
         */
        hover?: boolean;
        disabled?: boolean;
        /**
         * The target element to interact with for the Halo to show.
         * 
         * Defaults to the child element the Halo component is wrapped around.
         */
        target?: React.RefObject<P | null>;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    const touch = useRef(0);
    const endTouch = useRef<any>(undefined);
    const halo = useRef<HTMLDivElement>(null);

    const mutableRippleCount = useRef(0);
    const [rippleCount, ripple] = useState(0);
    const opacity = useLink(1);
    const translate = useLink('0% 0%');
    const focused = useLink(0);

    useEffect(() => {
        const parent = halo.current?.parentElement;
        const focusEl = target?.current || parent,
            ctrl = new AbortController(),
            signal = ctrl.signal;

        if (!focusEl || !parent) return;

        if (parent && style.target) parent.classList.add(style.target); // breaks on parent re-render.. (isolation: isolate)

        focusEl.addEventListener('mousedown', () => opacity.set(.5, { duration: .1 }), { signal });

        // trigger ripple animation at mouse position on click
        focusEl.addEventListener('click', e => {
            opacity.set(1);
            ripple(++mutableRippleCount.current);

            if (!halo.current) return;
            const { x, y, width, height } = halo.current.getBoundingClientRect();

            // skip opacity animation for touch based devices
            if (focused.value) focused.set(.25);

            const max = Math.max(width, height) * 2.8;
            const clamp = (val: number) => Math.min(Math.max(val, 0), 1);

            const dx = (clamp((e.clientX - x) / width) - .5) * (width / max);
            const dy = (clamp((e.clientY - y) / height) - .5) * (height / max);

            translate.set(`${e.clientX ? dx * 100 : 0}% ${e.clientY ? dy * 100 : 0}%`);
        }, { signal });

        function focus(selector = ':focus-visible') {
            if (focusEl) focused.set(focusEl.matches(selector) ? .25 : 0, { duration: .25 });
        }

        // show halo on touch devices
        focusEl.addEventListener('touchstart', () => {
            clearTimeout(endTouch.current);

            touch.current = Date.now();
            focused.set(.25, { duration: .25 });
        }, { signal });

        // hide halo on touch devices
        window.addEventListener('touchend', () => {
            const delay = Math.max(450 - Date.now() + touch.current, 0);

            endTouch.current = setTimeout(() => focus(), delay);
        }, { signal });

        focusEl.addEventListener('focusin', () => focus(), { signal });
        focusEl.addEventListener('focusout', () => focus(), { signal });
        focus(':focus');

        if (hover) {
            parent.addEventListener('mouseenter', () => focused.set(.25, { duration: .25 }), { signal });
            parent.addEventListener('mouseleave', () => focused.set(0, { duration: .25 }), { signal });
        }

        return () => ctrl.abort();
    }, [hover]);

    return <Animate
        correction="none"
        animate={{
            opacity: focused
        }}>
        <div
            {...props}
            ref={combineRefs(halo, ref)}
            className={classes(style.halo, props.className)}>
            {!disabled && <Animate
                correction="none"
                animate={{
                    translate,
                    opacity
                }}
                clips={{
                    ripple: {
                        opacity: [0, 1],
                        scale: [0, 1],
                        duration: .5,
                        easing: 'ease-in'
                    }
                }}
                triggers={{
                    ripple: [{ on: rippleCount, override: true }]
                }}>
                <div className={style.ripple} style={{ backgroundColor: color }} />
            </Animate>}
        </div>
    </Animate>;
}