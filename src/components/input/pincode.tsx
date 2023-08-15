'use client';

import { classes } from "../../../src/core/utils";
import useInputProps from "../../../src/hooks/use-input-props";
import useStyles from "../../../src/hooks/use-styles";
import { FluidError, FluidInputvalue, FluidSize, FluidStyles } from "../../../src/types";
import { forwardRef, useId, useRef, useState } from "react";

const Pincode = forwardRef(({ styles = {}, length = 4, masked, size = 'med', round = false, label, value, error, onChange, defaultvalue, autoFocus, ...props }:
    {
        defaultvalue?: FluidInputvalue;
        styles?: FluidStyles;
        length?: number;
        masked?: boolean;
        size?: FluidSize;
        round?: boolean;
        label?: string;
        value?: string;
        error?: FluidError;
        onChange?: (value: string) => void;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'type'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.wrapper': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xxs)'
        },

        '.label': {
            fontSize: '.8em',
            fontWeight: 500,
            color: 'var(--f-clr-text-100)'
        },

        '.pincode': {
            display: 'flex',
            gap: 'var(--f-spacing-xsm)'
        },

        '.field': {
            backgroundColor: 'var(--f-clr-fg-100)',
            border: 'solid 1px var(--f-clr-fg-200)',
            borderRadius: 'var(--f-radius-sml)',
            transition: 'border-color .2s',
            padding: '.6em',
            display: 'flex',
            flexGrow: 1
        },

        '.field:focus-within': {
            borderColor: 'var(--f-clr-primary-100)'
        },

        '.input': {
            border: 'none',
            outline: 'none',
            width: '1em',
            flexGrow: 1,
            background: 'none',
            textAlign: 'center',
            color: 'var(--f-clr-text-100)'
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

        '.pincode[data-round="true"] .field:first-child': {
            borderTopLeftRadius: '999px',
            borderBottomLeftRadius: '999px'
        },

        '.pincode[data-round="true"] .field:last-child': {
            borderTopRightRadius: '999px',
            borderBottomRightRadius: '999px'
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

        '.pincode[data-error="true"] .input': {
            color: 'var(--f-clr-error-200)'
        },
    });

    const id = useId();
    const refs = useRef<(HTMLInputElement | null)[]>([]);
    const [state, setState] = value !== undefined ? [value] : useState(defaultvalue?.toString().slice(0, length) || '');

    function handleKey(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
        let updated = state.slice();

        if (/^\d$/.test(e.key)) {
            e.preventDefault();

            if (state.length <= index) {
                updated += e.key;
            } else {
                updated = updated.slice(0, index) + e.key + updated.slice(index + 1);
            }

            refs.current[updated.length]?.focus();
        }

        if (e.key === 'Backspace') {
            e.preventDefault();
            updated = updated.slice(0, updated.length - 1);

            refs.current[updated.length - 1]?.focus();
        }

        setState?.(updated);
        onChange?.(updated);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let updated = e.target.value.replace(/\D/g, '');

        if (updated) {
            if (updated.length < length) updated = state + updated;
            updated = updated.slice(0, length);

            setState?.(updated);
            onChange?.(updated);
            refs.current[Math.min(updated.length, length - 1)]?.focus();
        }
    }

    const [split, rest] = useInputProps(props);

    return <div ref={ref} {...rest} className={classes(style.wrapper, props.className)} data-size={size}>
        {label && <div id={id} className={style.label}>{label}{props.required ? ' *' : ''}</div>}

        <div className={style.pincode} data-error={!!error} data-disabled={props.disabled} data-round={round}>
            {new Array(length).fill(0).map((_, i) => {
                return <div key={i} className={style.field}>
                    <input ref={el => refs.current[i] = el}
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
        </div>

        <input {...split} type="hidden" aria-labelledby={label ? id : undefined} value={state} />
    </div>;
});


Pincode.displayName = 'Pincode';

export default Pincode;