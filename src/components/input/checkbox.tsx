'use client';

import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidError, FluidSize, FluidStyles } from "@/src/types";
import { Animatable } from "@infinityfx/lively";
import { useLink } from "@infinityfx/lively/hooks";
import { forwardRef, useState, useEffect } from "react";
import Halo from "../feedback/halo";
import useInputProps from "@/src/hooks/use-input-props";

const Checkbox = forwardRef(({ styles = {}, error, size = 'med', color = 'var(--f-clr-primary-300)', checked, defaultChecked, ...props }:
    {
        styles?: FluidStyles;
        error?: FluidError;
        size?: FluidSize;
        color?: string;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.wrapper': {
            position: 'relative'
        },

        '.wrapper[data-size="xsm"]': {
            fontSize: 'var(--f-font-size-xxs)'
        },

        '.wrapper[data-size="sml"]': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.wrapper[data-size="med"]': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.wrapper[data-size="lrg"]': {
            fontSize: 'var(--f-font-size-med)'
        },

        '.input': {
            position: 'absolute',
            opacity: 0,
            inset: 0,
            zIndex: 1
        },

        '.checkbox': {
            width: '1.5em',
            height: '1.5em',
            borderRadius: 'var(--f-radius-sml)',
            border: 'solid 1px var(--f-clr-grey-100)',
            transition: 'background-color .25s, border-color .25s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },

        '.input:enabled': {
            cursor: 'pointer'
        },

        '.input:checked:enabled + .checkbox': {
            backgroundColor: color,
            borderColor: color
        },

        '.checkmark': {
            width: '1.1em',
            stroke: 'white',
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
        },

        '.input:disabled + .checkbox': {
            backgroundColor: 'var(--f-clr-grey-100)'
        },

        '.input:disabled + .checkbox .checkmark': {
            stroke: 'var(--f-clr-grey-500)'
        },

        '.input:disabled:checked + .checkbox': {
            backgroundColor: 'var(--f-clr-grey-200)',
            borderColor: 'var(--f-clr-grey-200)'
        },

        '.wrapper[data-error="true"] .input:enabled + .checkbox': {
            borderColor: 'var(--f-clr-error-200)'
        },

        '.wrapper[data-error="true"] .input:checked:enabled + .checkbox': {
            backgroundColor: 'var(--f-clr-error-200)'
        },

        '.halo': {
            borderRadius: 'var(--f-radius-sml) !important',
            inset: '-.5em !important'
        }
    });
    const [link, setLink] = useLink(defaultChecked ? 1 : 0);

    const [split, rest] = useInputProps(props);
    const [state, setState] = checked !== undefined ? [checked] : useState(defaultChecked || false);

    useEffect(() => setLink(state ? 1 : 0, .25), [state]);

    return <Halo className={style.halo} hover={false}>
        <div ref={ref} {...rest} className={classes(style.wrapper, rest.className)} data-error={!!error} data-size={size}>
            <input {...split} checked={state} type="checkbox" className={style.input} aria-invalid={!!error} onChange={e => {
                setState?.(e.target.checked);
                props.onChange?.(e);
            }} />

            <div className={style.checkbox}>
                <svg viewBox="0 0 18 18" className={style.checkmark}>
                    <Animatable animate={{ strokeLength: link }} initial={{ strokeDashoffset: split.defaultChecked ? 0 : 1 }}>
                        <path d="M 3 9 L 8 13 L 15 5" fill="none" />
                    </Animatable>
                </svg>
            </div>
        </div>
    </Halo>;
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;