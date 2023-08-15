'use client';

import { classes, combineRefs } from "../../../src/core/utils";
import useStyles from "../../../src/hooks/use-styles";
import { FluidStyles } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { useLink, useTrigger } from "@infinityfx/lively/hooks";
import { Children, cloneElement, forwardRef, isValidElement, useRef } from "react";

export type HaloStyles = FluidStyles<'.halo' | '.ring'>;

const Halo = forwardRef(<T extends React.ReactElement>({ children, styles = {}, color, hover = true, disabled = false, ...props }:
    {
        children: T;
        styles?: HaloStyles;
        color?: string;
        hover?: boolean;
        disabled?: boolean;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: React.ForwardedRef<T>) => {
    const style = useStyles(styles, {
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
            display: disabled ? 'none' : 'flex',
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

    const container = useRef<HTMLElement>(null);
    const click = useTrigger();
    const [translate, setTranslate] = useLink('0px 0px');

    children = Array.isArray(children) ? children[0] : children;
    if (!isValidElement(children)) return children;

    const arr = Children.toArray(children.props.children);
    arr.unshift(<div key="halo" className={style.halo} data-hover={hover}>
        <Animatable animate={{ translate, opacity: [0, 1], scale: [0, 1], duration: .4, easing: 'ease-in' }} initial={{ opacity: 1, scale: 1 }} triggers={[{ on: click, immediate: true }]}>
            <div className={style.ring} style={{ backgroundColor: color }} />
        </Animatable>
    </div>);

    return cloneElement(children, {
        ...props,
        ref: combineRefs(container, ref, (children as any).ref),
        className: classes(children.props.className, style.container),
        onClick: (e: React.MouseEvent<HTMLDivElement>) => {
            children.props.onClick?.(e);
            props.onClick?.(e);

            const { x, y, width, height } = container.current?.getBoundingClientRect() || { x: 0, y: 0, width: 0, height: 0 };

            if (e.clientX || e.clientY) setTranslate(`${e.clientX - (x + width / 2)}px ${e.clientY - (y + height / 2)}px`);
            click();
        }
    }, arr);
});

Halo.displayName = 'Halo';

export default Halo;