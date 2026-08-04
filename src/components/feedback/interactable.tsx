'use client';

import { classes, combineClasses, combineRefs } from "../../../src/core/utils";
import { PolymorphComponentProps, Selectors } from "../../../src/types";
import { Animate } from "@infinityfx/lively";
import { useLink } from "@infinityfx/lively/hooks";
import { useRef, useState, useLayoutEffect } from "react";
import { createStyles } from "../../core/style";

function getFocusElement(
    container: React.RefObject<HTMLElement | null>,
    target?: React.RefObject<HTMLElement | null> | HTMLElement | null
) {
    if (!target) return container.current;
    if ('current' in target) return target.current;

    return target;
}

const styles = createStyles('interactable', {
    '.interactable': {
        isolation: 'isolate',
        WebkitTapHighlightColor: 'transparent'
    },

    ':where(.interactable)': {
        border: 'none',
        outline: 'none',
        background: 'none'
    },

    '.highlight': {
        position: 'absolute',
        overflow: 'hidden',
        borderRadius: 'inherit',
        inset: 0,
        minWidth: '100%',
        minHeight: '100%',
        transition: 'opacity .2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: 0,
        zIndex: -1
    },

    '.ripple': {
        minWidth: '280%',
        minHeight: '280%',
        aspectRatio: 1,
        borderRadius: '9999px',
        backgroundColor: 'var(--f-clr-highlight-200)',
        zIndex: -1
    },

    '.interactable > .focused': {
        opacity: .25
    },

    '@media (pointer: fine)': {
        '.interactable:hover > .hover, .interactable > .hover.active': {
            opacity: .25
        }
    },

    '@media (pointer: coarse)': {
        '.interactable > .active': {
            opacity: .25
        }
    }
});

export type InteractableSelectors = Selectors<'interactable' | 'highlight' | 'hover' | 'active' | 'focused' | 'ripple'>;

/**
 * Shows a highlight when hovered, focused or clicked.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/interactable}
 */
export default function Interactable<P extends HTMLElement, E extends React.ElementType = 'button'>({ children, cc = {}, as, disabled, highlightColor, noHover, interactTarget, ...props }:
    {
        ref?: React.Ref<any>;
        cc?: InteractableSelectors;
        as?: E;
        disabled?: boolean;
        /**
         * Prevent a highlight from showing when hovering.
         * 
         * @default false
         */
        noHover?: boolean;
        highlightColor?: string;
        /**
         * The target element to interact with for a highlight to show.
         * 
         * @default self
         */
        interactTarget?: React.RefObject<P | null> | P | null;
    } & PolymorphComponentProps<E>) {
    const style = combineClasses(styles, cc);

    const start = useRef(0);
    const timeout = useRef<any>(undefined);
    const container = useRef<HTMLElement>(null);
    const highlight = useRef<HTMLDivElement>(null);
    const mounted = useRef(false);

    const mutableRippleCount = useRef(0);
    const [rippleCount, ripple] = useState(0);
    const opacity = useLink(1);
    const translate = useLink('0% 0%');

    useLayoutEffect(() => {
        const focusEl = getFocusElement(container, interactTarget),
            highlightEl = highlight.current,
            ctrl = new AbortController(),
            signal = ctrl.signal;

        if (!focusEl || !highlightEl || !container.current) return;

        // show highlight when target has focus
        function focus(selector = ':focus-visible') {
            if (!focusEl || !highlightEl) return;

            highlightEl.classList[focusEl.matches(selector) ? 'add' : 'remove'](style.focused as any);
        }

        function setActive() {
            clearTimeout(timeout.current);
            start.current = Date.now();

            if (highlightEl) highlightEl.classList.add(style.active as any);
        }

        // hide highlight, but wait for ripple animation to finish
        function removeActive() {
            // show highlight for a minimum of 350ms
            const delay = Math.max(350 - Date.now() + start.current, 0);

            focus();

            timeout.current = setTimeout(() => {
                if (highlightEl) highlightEl.classList.remove(style.active as any);
            }, delay);
        }

        focusEl.addEventListener('mousedown', () => opacity.set(.5, { duration: .1 }), { signal });

        // trigger ripple animation at mouse position on click
        focusEl.addEventListener('click', e => {
            if (!highlightEl) return;

            setActive();
            opacity.set(1, { duration: 0 });
            ripple(++mutableRippleCount.current);

            const { x, y, width, height } = highlightEl.getBoundingClientRect();

            // skip highlight fade-in animation for touch based devices
            highlightEl.style.transition = 'none';
            highlightEl.offsetHeight;
            highlightEl.style.transition = '';

            const max = Math.max(width, height) * 2.8;
            const clamp = (val: number) => Math.min(Math.max(val, 0), 1);

            const dx = (clamp((e.clientX - x) / width) - .5) * (width / max);
            const dy = (clamp((e.clientY - y) / height) - .5) * (height / max);

            translate.set(`${e.clientX ? dx * 100 : 0}% ${e.clientY ? dy * 100 : 0}%`, { duration: 0 });

            removeActive();
        }, { signal });

        // show highlight for touch devices
        focusEl.addEventListener('touchstart', setActive, { signal });
        window.addEventListener('touchend', removeActive, { signal });

        focusEl.addEventListener('focusin', () => focus(), { signal });
        focusEl.addEventListener('focusout', () => focus(), { signal });

        if (!mounted.current) {
            focus(':focus');
            mounted.current = true;
        }

        return () => {
            highlightEl.classList.remove(style.active as any);
            clearTimeout(timeout.current);
            ctrl.abort();
        };
    }, [disabled, interactTarget]);

    const Wrapper = as || 'button';
    const defaultProps = Wrapper === 'button' ? {
        type: props.type || 'button' as const,
        disabled
    } : {};

    return <Wrapper
        {...defaultProps}
        {...props}
        ref={combineRefs(container, props.ref)}
        className={classes(style.interactable, props.className)}>
        {!disabled && <div ref={highlight} className={classes(
            style.highlight,
            !noHover && style.hover
        )}>
            <Animate
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

                <div className={style.ripple} style={{
                    backgroundColor: highlightColor
                }} />
            </Animate>
        </div>}

        {children}
    </Wrapper>;
}