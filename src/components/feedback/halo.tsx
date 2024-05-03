'use client';

import { classes, combineClasses, combineRefs } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { useLink, useTrigger } from "@infinityfx/lively/hooks";
import { Children, cloneElement, forwardRef, isValidElement, useRef, useEffect } from "react";
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
        transition: 'opacity .25s, scale .25s',
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

    '@media (pointer: coarse)': {
        '.container:active > .halo': {
            opacity: .25
        }
    },

    '.ripple': {
        minWidth: '241%',
        minHeight: '241%',
        aspectRatio: 1,
        backgroundColor: 'var(--f-clr-grey-500)',
        borderRadius: '9999px',
        zIndex: -1
    }
});

export type HaloSelectors = Selectors<'halo' | 'ripple'>;

const Halo = forwardRef(<T extends React.ReactElement>({ children, cc = {}, color, hover = true, disabled = false, target, ...props }:
    {
        children: T;
        cc?: HaloSelectors;
        color?: string;
        hover?: boolean;
        disabled?: boolean;
        target?: React.RefObject<HTMLElement>;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: React.ForwardedRef<T>) => {
    const style = combineClasses(styles, cc);

    const container = useRef<HTMLElement>(null);
    const halo = useRef<HTMLDivElement>(null);

    const clickTrigger = useTrigger();
    const translate = useLink('0% 0%');

    useEffect(() => {
        const focusEl = target?.current || container.current;
        if (!focusEl) return;

        function click(e: MouseEvent) {
            if (halo.current) {
                const { x, y, width, height } = halo.current.getBoundingClientRect();

                const max = Math.max(width, height) * 2.41;
                const dx = ((e.clientX - x) / width - .5) * (width / max);
                const dy = ((e.clientY - y) / height - .5) * (height / max);

                translate.set(`${e.clientX ? dx * 100 : 0}% ${e.clientY ? dy * 100 : 0}px`);
            }

            clickTrigger();
        }

        function focus(e: FocusEvent) {
            if (!halo.current) return;

            const visible = (e.target as HTMLElement).matches(':focus-visible');

            if (e.type === 'focusin' && visible) {
                halo.current.dataset.focused = 'true';
            } else
                if (e.type === 'focusout') {
                    halo.current.dataset.focused = 'false';
                }
        }

        focusEl.addEventListener('click', click);
        focusEl.addEventListener('focusin', focus);
        focusEl.addEventListener('focusout', focus);

        return () => {
            focusEl.removeEventListener('click', click);
            focusEl.removeEventListener('focusin', focus);
            focusEl.removeEventListener('focusout', focus);
        }
    }, [clickTrigger]);

    children = Array.isArray(children) ? children[0] : children;
    if (!isValidElement(children)) return children;

    const childrenArray = Children.toArray(children.props.children);

    childrenArray.unshift(<div ref={halo} key="halo" className={style.halo} data-hover={hover} data-disabled={disabled}>
        <Animatable
            initial={{ opacity: 1, scale: 1 }}
            animate={{
                translate,
                opacity: [0, 1],
                scale: [0, 1],
                duration: .4,
                easing: 'ease-in'
            }}
            triggers={[{ on: clickTrigger, immediate: true }]}>

            <div className={style.ripple} style={{ backgroundColor: color }} />
        </Animatable>
    </div>);

    return cloneElement(children, {
        ...props,
        ref: combineRefs(container, ref, (children as any).ref),
        className: classes(children.props.className, style.container)
    }, childrenArray);
});

Halo.displayName = 'Halo';

export default Halo;