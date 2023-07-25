'use client';

import useStyles from "@/src/hooks/use-styles";
import { FluidSize, FluidStyles } from "@/src/types";
import { forwardRef, useState } from "react";
import Halo from "../feedback/halo";
import useInputProps from "@/src/hooks/use-input-props";
import { Animatable } from "@infinityfx/lively";
import { classes } from "@/src/core/utils";

export type ToggleStyles = FluidStyles<'.toggle' | '.content' | '.container' | '.toggle__xsm' | '.toggle__sml' | '.toggle__med' | '.toggle__lrg' | '.toggle__round' | '.toggle__var__default' | '.toggle__var__minimal' | '.toggle__var__neutral'>;

export type ToggleProps = {
    styles?: FluidStyles;
    size?: FluidSize;
    round?: boolean;
    variant?: 'default' | 'minimal' | 'neutral';
    checkedContent?: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>;

const Toggle = forwardRef(({ children, styles = {}, size = 'med', round = false, variant = 'default', checkedContent, ...props }: ToggleProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.input': {
            position: 'absolute',
            opacity: 0,
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 2
        },

        '.input:enabled': {
            cursor: 'pointer'
        },

        '.toggle': {
            position: 'relative',
            display: 'block',
            backgroundColor: 'var(--f-clr-fg-100)',
            color: 'var(--f-clr-text-100)',
            padding: '.5em',
            borderRadius: 'var(--f-radius-sml)',
            transition: 'background-color .25s, color .25s'
        },

        '.toggle__xsm': {
            fontSize: 'var(--f-font-size-xxs)'
        },

        '.toggle__sml': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.toggle__med': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.toggle__lrg': {
            fontSize: 'var(--f-font-size-med)'
        },

        '.toggle__var__minimal': {
            backgroundColor: 'transparent'
        },

        '.toggle__var__neutral': {
            backgroundColor: 'var(--f-clr-fg-100)',
            border: 'solid 1px var(--f-clr-fg-200)'
        },

        '.content': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--f-spacing-xsm)',
            gridArea: '1 / 1 / 1 / 1'
        },

        '.container': {
            display: 'grid',
            overflow: 'hidden'
        },

        '.toggle[data-checked="true"]:not(.toggle__var__neutral)': {
            backgroundColor: 'var(--f-clr-primary-100)',
            color: 'var(--f-clr-text-200)'
        },

        '.toggle__var__neutral[data-checked="true"]': {
            backgroundColor: 'var(--f-clr-fg-200)'
        },

        '.toggle__var__minimal[data-checked="true"]': {
            backgroundColor: 'var(--f-clr-primary-300)'
        },

        '.toggle[data-checked="false"][data-disabled="true"]': {
            color: 'var(--f-clr-grey-500)'
        },

        '.toggle[data-checked="true"][data-disabled="true"]': {
            backgroundColor: 'var(--f-clr-grey-300)',
            color: 'var(--f-clr-grey-100)'
        },

        '.toggle__round': {
            borderRadius: '999px'
        }
    });

    const [state, setState] = props.checked !== undefined ? [props.checked] : useState(!!props.defaultChecked);
    const [split, rest] = useInputProps(props);

    const triggers = [
        { on: state, immediate: true },
        { on: !state, reverse: true, immediate: true }
    ];

    return <Halo disabled={props.disabled}>
        <div ref={ref} {...rest}
            className={classes(
                style.toggle,
                round && style.toggle__round,
                style[`toggle__${size}`],
                style[`toggle__var__${variant}`],
                props.className
            )}
            data-checked={state}
            data-disabled={!!props.disabled}>
            <input {...split} type="checkbox" className={style.input} onChange={e => {
                setState?.(e.target.checked);
                split.onChange?.(e);
            }} />

            <div className={style.container}>
                {checkedContent ? <Animatable
                    animate={{ translate: ['0 0', '0 -100%'], duration: .4 }}
                    initial={{ translate: state ? '0 -100%' : '0 0' }}
                    triggers={triggers}>
                    <div className={style.content}>{children}</div>
                </Animatable> : <div className={style.content}>{children}</div>}

                {checkedContent ? <Animatable
                    animate={{ translate: ['0 100%', '0 0'], duration: .4 }}
                    initial={{ translate: state ? '0 0' : '0 100%' }}
                    triggers={triggers}>
                    <div className={style.content}>{checkedContent}</div>
                </Animatable> : null}
            </div>
        </div>
    </Halo>;
});

Toggle.displayName = 'Toggle';

export default Toggle;