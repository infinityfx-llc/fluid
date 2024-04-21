'use client';

import { classes, combineClasses, combineRefs } from "../../../src/core/utils";
import { FluidStyles, Selectors } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { useLink, useTrigger } from "@infinityfx/lively/hooks";
import { Children, cloneElement, forwardRef, isValidElement, useRef, useEffect } from "react";
import { createStyles } from "../../core/style";

export type HaloStyles = FluidStyles<'.container' | '.halo' | '.ring'>;

const Halo = forwardRef(<T extends React.ReactElement>({ children, cc = {}, color, hover = true, disabled = false, ...props }:
    {
        children: T;
        cc?: Selectors<'container' | 'halo' | 'ring'>;
        color?: string;
        hover?: boolean;
        disabled?: boolean;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: React.ForwardedRef<T>) => {
    const styles = createStyles('halo', {
        '.container': {
            zIndex: 0
        },

        '.halo': {
            position: 'absolute',
            overflow: 'hidden',
            borderRadius: 'inherit',
            inset: 0,
            opacity: 0,
            zIndex: -1,
            transition: 'opacity .25s, scale .25s',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
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

        '.container:focus-visible > .halo, .container:has(:focus-visible) > .halo': {
            opacity: .25
        },

        '@supports not selector(:focus-visible)': {
            '.container:focus-within > .halo': {
                opacity: .25
            }
        },

        '.ring': {
            minWidth: '241%',
            minHeight: '241%',
            aspectRatio: 1,
            backgroundColor: 'var(--f-clr-grey-500)',
            borderRadius: '9999px',
            zIndex: -1
        }
    });
    const style = combineClasses(styles, cc);

    const container = useRef<HTMLElement>(null);
    const click = useTrigger();
    const translate = useLink('0px 0px');

    useEffect(() => {
        const el = container.current;
        if (!el) return;

        const handleClick = (e: MouseEvent) => {
            if (container.current && (e.clientX || e.clientY)) {
                const { x, y, width, height } = container.current.getBoundingClientRect();
                translate.set(`${e.clientX - (x + width / 2)}px ${e.clientY - (y + height / 2)}px`);
            }

            click();
        }

        el.addEventListener('click', handleClick);

        return () => el.removeEventListener('click', handleClick);
    }, [click]);

    children = Array.isArray(children) ? children[0] : children;
    if (!isValidElement(children)) return children;

    const arr = Children.toArray(children.props.children);
    arr.unshift(<div key="halo" className={style.halo} data-hover={hover} style={{ display: disabled ? 'none' : 'flex' }}>
        <Animatable animate={{ translate, opacity: [0, 1], scale: [0, 1], duration: .4, easing: 'ease-in' }} initial={{ opacity: 1, scale: 1 }} triggers={[{ on: click, immediate: true }]}>
            <div className={style.ring} style={{ backgroundColor: color }} />
        </Animatable>
    </div>);

    return cloneElement(children, {
        ...props,
        ref: combineRefs(container, ref, (children as any).ref),
        className: classes(children.props.className, style.container)
    }, arr);
});

Halo.displayName = 'Halo';

export default Halo;