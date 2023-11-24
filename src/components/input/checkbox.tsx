'use client';

import { classes, combineClasses } from "../../../src/core/utils";
import { FluidError, FluidSize, FluidStyles, Selectors } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { useLink } from "@infinityfx/lively/hooks";
import { forwardRef, useState, useEffect } from "react";
import Halo from "../feedback/halo";
import useInputProps from "../../../src/hooks/use-input-props";
import { createStyles } from "../../core/style";

export type CheckboxStyles = FluidStyles<'.wrapper' | '.checkbox' | '.checkmark' | '.wrapper__xsm' | '.wrapper__sml' | '.wrapper__med' | '.wrapper__lrg' | '.halo'>;

const Checkbox = forwardRef(({ cc = {}, error, size = 'med', color = 'var(--f-clr-primary-300)', checked, defaultChecked, ...props }:
    {
        cc?: Selectors<'wrapper' | 'checkbox' | 'checkmark' | 'wrapper__xsm' | 'wrapper__sml' | 'wrapper__med' | 'wrapper__lrg' | 'halo'>;
        error?: FluidError;
        size?: FluidSize;
        color?: string;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('checkbox', {
        '.wrapper': {
            position: 'relative',
            width: 'max-content'
        },

        '.wrapper__xsm': {
            fontSize: 'var(--f-font-size-xxs)'
        },

        '.wrapper__sml': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.wrapper__med': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.wrapper__lrg': {
            fontSize: 'var(--f-font-size-med)'
        },

        '.input': {
            position: 'absolute',
            opacity: 0,
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
        },

        '.checkbox': {
            width: '1.5em',
            height: '1.5em',
            borderRadius: 'var(--f-radius-sml)',
            backgroundColor: 'var(--f-clr-bg-100)',
            border: 'solid 1px var(--f-clr-fg-200)',
            transition: 'background-color .25s, border-color .25s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },

        '.input:enabled': {
            cursor: 'pointer'
        },

        '.checkmark': {
            width: '1em',
            stroke: 'white',
            strokeWidth: 3,
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
    const style = combineClasses(styles, cc);

    const link = useLink(defaultChecked ? 1 : 0);

    const [split, rest] = useInputProps(props);
    const [state, setState] = checked !== undefined ? [checked] : useState(defaultChecked || false);

    useEffect(() => link.set(state ? 1 : 0, .25), [state]);

    return <Halo hover={false} cc={{ halo: style.halo }}>
        <div ref={ref} {...rest} className={classes(
            style.wrapper,
            style[`wrapper__${size}`],
            rest.className
        )} data-error={!!error}>
            <input {...split} checked={state} type="checkbox" className={style.input} aria-invalid={!!error} onChange={e => {
                setState?.(e.target.checked);
                props.onChange?.(e);
            }} />

            <div className={style.checkbox} style={(state && !split.disabled) ? { backgroundColor: color, borderColor: color } : undefined}>
                <svg viewBox="0 0 18 18" className={style.checkmark}>
                    <Animatable animate={{ strokeLength: link }} initial={{ strokeDashoffset: state ? 0 : 1 }}>
                        <path d="M 3 9 L 8 13 L 15 5" fill="none" />
                    </Animatable>
                </svg>
            </div>
        </div>
    </Halo>;
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;