'use client';

import { classes, combineClasses, combineRefs } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { useLink, useTrigger } from "@infinityfx/lively/hooks";
import { Children, cloneElement, isValidElement, useRef, useEffect } from "react";
import { createStyles } from "../../core/style";

const styles = createStyles('halo', {
    '.container': {
        isolation: 'isolate'
    },

    '.halo': {
        position: 'absolute',
        overflow: 'hidden',
        borderRadius: 'inherit',
        inset: 0,
        minWidth: '100%',
        minHeight: '100%',
        transition: 'opacity .25s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: 0,
        zIndex: -1
    },

    '.halo[data-disabled="true"]': {
        display: 'none'
    },

    '.halo[data-focused="true"]': {
        opacity: .25
    },

    '@media (pointer: fine)': {
        '.container:hover > .halo[data-hover="true"]': {
            opacity: .25
        }
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
export default function Halo<T extends React.ReactElement<any>, P extends HTMLElement>({ children, cc = {}, color, hover = true, disabled = false, target, ref, ...props }:
    {
        children: T;
        ref?: React.Ref<any>;
        cc?: HaloSelectors;
        color?: string;
        hover?: boolean;
        disabled?: boolean;
        target?: React.RefObject<P | null>;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const style = combineClasses(styles, cc);

    const touch = useRef(0);
    const endTouch = useRef<any>(undefined);
    const container = useRef<HTMLElement>(null);
    const halo = useRef<HTMLDivElement>(null);

    const ripple = useTrigger();
    const opacity = useLink(1);
    const translate = useLink('0% 0%');

    useEffect(() => {
        const focusEl = target?.current || container.current,
            ctrl = new AbortController(),
            signal = ctrl.signal;

        if (!focusEl) return;

        function focus(selector = ':focus-visible') {
            if (!halo.current || !focusEl) return;

            halo.current.dataset.focused = '' + focusEl.matches(selector);
        }

        focusEl.addEventListener('mousedown', () => {
            opacity.set(.5, {
                duration: .1
            });
        }, { signal });

        // trigger ripple animation at mouse position on click
        focusEl.addEventListener('click', e => {
            opacity.set(1);
            ripple();

            if (!halo.current) return;
            const { x, y, width, height } = halo.current.getBoundingClientRect();

            // skip opacity animation for touch based devices
            halo.current.style.transition = 'none';
            halo.current.offsetHeight;
            halo.current.style.transition = '';

            const max = Math.max(width, height) * 2.8;
            const dx = ((e.clientX - x) / width - .5) * (width / max);
            const dy = ((e.clientY - y) / height - .5) * (height / max);

            translate.set(`${e.clientX ? dx * 100 : 0}% ${e.clientY ? dy * 100 : 0}%`);
        }, { signal });

        // show halo on touch devices
        focusEl.addEventListener('touchstart', () => {
            clearTimeout(endTouch.current);
            touch.current = Date.now();

            if (halo.current) halo.current.style.opacity = '0.25';
        }, { signal });

        // hide halo on touch devices
        window.addEventListener('touchend', () => {
            const delay = Math.max(450 - Date.now() + touch.current, 0);

            endTouch.current = setTimeout(() => {
                if (halo.current) halo.current.style.opacity = '';
            }, delay);
        }, { signal });

        focusEl.addEventListener('focusin', () => focus(), { signal });
        focusEl.addEventListener('focusout', () => focus(), { signal });
        focus(':focus');

        return () => ctrl.abort();
    }, []);

    children = Array.isArray(children) ? children[0] : children;
    if (!isValidElement(children)) return children;

    const childrenArray = Children.toArray(children.props.children);

    childrenArray.unshift(<div ref={halo} key="halo" className={style.halo} data-hover={hover} data-disabled={disabled}>
        <Animatable
            animate={{
                translate,
                opacity
            }}
            animations={{
                ripple: {
                    opacity: [0, 1],
                    scale: [0, 1],
                    duration: .5,
                    easing: 'ease-in'
                }
            }}
            triggers={[
                { on: ripple, name: 'ripple', immediate: true }
            ]}>

            <div className={style.ripple} style={{ backgroundColor: color }} />
        </Animatable>
    </div>);

    return cloneElement(children, {
        ...props,
        ref: combineRefs(container, ref, children.props.ref),
        className: classes(children.props.className, style.container)
    }, childrenArray);
}