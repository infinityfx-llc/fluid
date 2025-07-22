'use client';

import { classes, combineClasses } from "../../../src/core/utils";
import useInputProps from "../../../src/hooks/use-input-props";
import { FluidInputvalue, FluidSize, Selectors } from "../../../src/types";
import { useRef, useState } from "react";
import { createStyles } from "../../core/style";

const styles = createStyles('pincode', {
    '.pincode': {
        display: 'flex',
        gap: 'var(--f-spacing-xsm)'
    },

    '.group': {
        display: 'flex',
        flexGrow: 1
    },

    '.field': {
        outline: 'solid 3px transparent',
        backgroundColor: 'var(--f-clr-fg-100)',
        border: 'solid 1px var(--f-clr-fg-200)',
        borderRadius: 'var(--f-radius-sml)',
        transition: 'border-color .2s, outline-color .2s',
        display: 'flex',
        flexGrow: 1
    },

    '.group .field + .field': {
        marginLeft: '-1px',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    },

    '.group .field:not(:last-child)': {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    },

    '.field:focus-within': {
        borderColor: 'var(--f-clr-primary-100)',
        outlineColor: 'var(--f-clr-primary-500)',
        zIndex: 1
    },

    '.input': {
        boxSizing: 'content-box',
        border: 'none',
        outline: 'none',
        width: '1em',
        flexGrow: 1,
        padding: '.675em',
        background: 'none',
        textAlign: 'center',
        color: 'var(--f-clr-text-100)'
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

    '.pincode.round .field:first-child': {
        borderTopLeftRadius: 'calc(1.4em + 1px)',
        borderBottomLeftRadius: 'calc(1.4em + 1px)'
    },

    '.pincode.round .field:last-child': {
        borderTopRightRadius: 'calc(1.4em + 1px)',
        borderBottomRightRadius: 'calc(1.4em + 1px)'
    },

    '.pincode[data-disabled="true"] .field': {
        backgroundColor: 'var(--f-clr-grey-100)',
        borderColor: 'var(--f-clr-grey-200)'
    },

    '.pincode[data-disabled="true"] .input': {
        color: 'var(--f-clr-grey-500)'
    },

    '.pincode[data-error="true"] .field': {
        borderColor: 'var(--f-clr-error-100)'
    },

    '.pincode[data-error="true"] .field:focus-within': {
        outlineColor: 'var(--f-clr-error-400)'
    },

    '.pincode[data-error="true"] .input': {
        color: 'var(--f-clr-error-200)'
    }
});

export type PincodeSelectors = Selectors<'pincode' | 'field' | 'input' | 's__xsm' | 's__sml' | 's__med' | 's__lrg' | 'round'>;

/**
 * An input used for entering numerical codes.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/pincode}
 */
export default function Pincode({ cc = {}, format = [1, 1, 1, 1], masked, size = 'med', round = false, value, error, onChange, defaultvalue, autoFocus, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: PincodeSelectors;
        defaultvalue?: FluidInputvalue;
        /**
         * An `array` of numbers indicating how many inputs to show.
         * 
         * A single digit represents a number of grouped inputs.
         * 
         * Multiple comma-seperated digits represent spaced apart inputs.
         * 
         * @default [1, 1, 1, 1]
         */
        format?: number[];
        /**
         * Whether to hide the entered pincode input.
         * 
         * @default false
         */
        masked?: boolean;
        size?: FluidSize;
        round?: boolean;
        value?: string;
        error?: any;
        onChange?: (value: string) => void;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'type'>) {
    const style = combineClasses(styles, cc);

    const refs = useRef<(HTMLInputElement | null)[]>([]);

    const length = format.reduce((len, val) => len + val, 0);
    const [state, setState] = value !== undefined ? [value] : useState(defaultvalue?.toString().slice(0, length) || '');

    // update value and focus when user is typing
    function handleKey(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
        let updated = state.slice();

        if (/^\d$/.test(e.key)) {
            // append a valid number character and move focus to next input
            e.preventDefault();

            if (state.length <= index) {
                updated += e.key;
            } else {
                updated = updated.slice(0, index) + e.key + updated.slice(index + 1);
            }

            refs.current[updated.length]?.focus();
        }

        if (e.key === 'Backspace') {
            // delete the last character and move focus to previous input
            e.preventDefault();
            updated = updated.slice(0, updated.length - 1);

            refs.current[updated.length - 1]?.focus();
        }

        setState?.(updated);
        onChange?.(updated);
    }

    // update value when user pastes from their clipboard
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let updated = e.target.value.replace(/\D/g, ''); // keep only number characters

        if (updated) {
            if (updated.length < length) updated = state + updated;
            updated = updated.slice(0, length);

            setState?.(updated);
            onChange?.(updated);
            refs.current[Math.min(updated.length, length - 1)]?.focus();
        }
    }

    const [split, rest] = useInputProps(props);

    return <div
        {...rest}
        className={classes(
            style.pincode,
            style[`s__${size}`],
            round && style.round,
            props.className
        )}
        data-error={!!error}
        data-disabled={props.disabled}
        data-fb>

        {format.map((count, i) => {
            const min = format.slice(0, i).reduce((len, val) => len + val, 0);

            return <div key={i} className={style.group}>
                {new Array(count).fill(0).map((_, i) => {
                    i += min;

                    return <div key={i} className={style.field}>
                        <input ref={el => {
                            refs.current[i] = el;
                        }}
                            aria-label={split['aria-label']}
                            aria-labelledby={split['aria-labelledby']}
                            autoFocus={i === 0 && autoFocus}
                            disabled={props.disabled}
                            className={style.input}
                            aria-invalid={!!error}
                            inputMode="numeric"
                            type={masked ? 'password' : 'text'}
                            value={state.charAt(i)}
                            onChange={handleChange}
                            onKeyDown={e => handleKey(e, i)} />
                    </div>;
                })}
            </div>;
        })}

        <input {...split} type="hidden" value={state} />
    </div>;
}