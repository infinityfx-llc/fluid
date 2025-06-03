'use client';

import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, Selectors } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { useLink } from "@infinityfx/lively/hooks";
import { useState, useEffect } from "react";
import Halo from "../feedback/halo";
import useInputProps from "../../../src/hooks/use-input-props";
import { createStyles } from "../../core/style";

const styles = createStyles('checkbox', {
    '.wrapper': {
        position: 'relative',
        width: 'max-content'
    },

    '.s__xsm': {
        fontSize: 'var(--f-font-size-xxs)'
    },

    '.s__sml': {
        fontSize: 'var(--f-font-size-xsm)'
    },

    '.s__med': {
        fontSize: 'var(--f-font-size-sml)'
    },

    '.s__lrg': {
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
        backgroundColor: 'var(--f-clr-fg-100)',
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
        backgroundColor: 'var(--f-clr-grey-100)',
        borderColor: 'var(--f-clr-grey-200)'
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

    '.input:checked:enabled + .checkbox': {
        backgroundColor: 'var(--color, var(--f-clr-primary-300))',
        borderColor: 'var(--color, var(--f-clr-primary-300))'
    },

    '.wrapper[data-error="true"] .input:checked:enabled + .checkbox': {
        backgroundColor: 'var(--f-clr-error-200)'
    },

    '.wrapper .halo': {
        borderRadius: 'var(--f-radius-sml)',
        inset: '-.5em'
    }
});

export type CheckboxSelectors = Selectors<'wrapper' | 'checkbox' | 'checkmark' | 's__xsm' | 's__sml' | 's__med' | 's__lrg'>;

/**
 * An input that switches between a checked and unchecked state.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/checkbox}
 */
export default function Checkbox({ cc = {}, error, size = 'med', color, intermediate, checked, defaultChecked, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: CheckboxSelectors;
        error?: any;
        size?: FluidSize;
        color?: string;
        intermediate?: boolean;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>) {
    const style = combineClasses(styles, cc);

    const link = useLink(defaultChecked ? 1 : 0);

    const [split, rest] = useInputProps(props);
    const [state, setState] = checked !== undefined ? [checked] : useState(defaultChecked || false);

    useEffect(() => link.set(state ? 1 : 0, { duration: .25 }), [state]);

    return <Halo hover={false} cc={{ halo: style.halo, ...cc }}>
        <div {...rest}
            className={classes(
                style.wrapper,
                style[`s__${size}`],
                rest.className
            )}
            data-error={!!error}>

            <input {...split} checked={state} type="checkbox" className={style.input} aria-invalid={!!error} onChange={e => {
                setState?.(e.target.checked);
                props.onChange?.(e);
            }} />

            <div className={style.checkbox} style={{ '--color': color } as any}>
                <svg viewBox="0 0 18 18" className={style.checkmark}>
                    {intermediate ?
                        <Animatable animate={{ strokeLength: link }} initial={{ strokeDashoffset: state ? 0 : 1 }}>
                            <path d="M 3 9 L 15 9" fill="none" />
                        </Animatable> :
                        <Animatable animate={{ strokeLength: link }} initial={{ strokeDashoffset: state ? 0 : 1 }}>
                            <path d="M 3 9 L 8 13 L 15 5" fill="none" />
                        </Animatable>
                    }
                </svg>
            </div>
        </div>
    </Halo>;
}