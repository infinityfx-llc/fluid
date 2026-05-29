'use client';

import { classes, combineClasses, combineRefs } from "../../../src/core/utils";
import { PolymorphComponentProps, Selectors } from "../../../src/types";
import { Animate } from "@infinityfx/lively";
import { useLink } from "@infinityfx/lively/hooks";
import { useRef, useEffect, useState } from "react";
import { createStyles } from "../../core/style";

const styles = createStyles('interactable', {
    '.interactable': {
        isolation: 'isolate',
        border: 'none',
        outline: 'none',
        background: 'none',
        WebkitTapHighlightColor: 'transparent'
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
        backgroundColor: 'var(--f-clr-grey-500)',
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
        interactTarget?: React.RefObject<P | null>;
    } & PolymorphComponentProps<E>) {
    const style = combineClasses(styles, cc);

    const start = useRef(0);
    const timeout = useRef<any>(undefined);
    const container = useRef<HTMLElement>(null);
    const highlight = useRef<HTMLDivElement>(null);

    const mutableRippleCount = useRef(0);
    const [rippleCount, ripple] = useState(0);
    const opacity = useLink(1);
    const translate = useLink('0% 0%');

    useEffect(() => {
        const focusEl = interactTarget?.current || container.current,
            ctrl = new AbortController(),
            signal = ctrl.signal;

        if (!focusEl || !container.current) return;

        // show highlight when target has focus
        function focus(selector = ':focus-visible') {
            if (!focusEl || !highlight.current) return;

            highlight.current.classList[focusEl.matches(selector) ? 'add' : 'remove'](style.focused as any);
        }

        function setActive() {
            clearTimeout(timeout.current);
            start.current = Date.now();

            if (highlight.current) highlight.current.classList.add(style.active as any);
        }

        // hide highlight, but wait for ripple animation to finish
        function removeActive() {
            // show highlight for a minimum of 350ms
            const delay = Math.max(350 - Date.now() + start.current, 0);

            focus();

            timeout.current = setTimeout(() => {
                if (highlight.current) highlight.current.classList.remove(style.active as any);
            }, delay);
        }

        focusEl.addEventListener('mousedown', () => opacity.set(.5, { duration: .1 }), { signal });

        // trigger ripple animation at mouse position on click
        focusEl.addEventListener('click', e => {
            if (!highlight.current) return;

            setActive();
            opacity.set(1, { duration: 0 });
            ripple(++mutableRippleCount.current);

            const { x, y, width, height } = highlight.current.getBoundingClientRect();

            // skip highlight fade-in animation for touch based devices
            highlight.current.style.transition = 'none';
            highlight.current.offsetHeight;
            highlight.current.style.transition = '';

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
        focus(':focus');

        return () => {
            if (highlight.current) highlight.current.classList.remove(style.active as any);
            clearTimeout(timeout.current);
            ctrl.abort();
        }
    }, [props.disabled]);

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