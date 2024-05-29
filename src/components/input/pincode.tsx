'use client';

import { classes, combineClasses } from "../../../src/core/utils";
import useInputProps from "../../../src/hooks/use-input-props";
import { FluidError, FluidInputvalue, FluidSize, Selectors } from "../../../src/types";
import { useId, useRef, useState } from "react";
import { createStyles } from "../../core/style";

const styles = createStyles('pincode', {
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
        padding: '.675em',
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
        border: 'none',
        outline: 'none',
        width: '1em',
        flexGrow: 1,
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

    '.wrapper.round .field:first-child': {
        borderTopLeftRadius: '999px',
        borderBottomLeftRadius: '999px'
    },

    '.wrapper.round .field:last-child': {
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

    '.pincode[data-error="true"] .field:focus-within': {
        outlineColor: 'var(--f-clr-error-400)'
    },

    '.pincode[data-error="true"] .input': {
        color: 'var(--f-clr-error-200)'
    }
});

export type PincodeSelectors = Selectors<'wrapper' | 'label' | 'pincode' | 'field' | 'input' | 's__xsm' | 's__sml' | 's__med' | 's__lrg' | 'round'>;

export default function Pincode({ cc = {}, format = [1, 1, 1, 1], masked, size = 'med', round = false, label, value, error, onChange, defaultvalue, autoFocus, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: PincodeSelectors;
        defaultvalue?: FluidInputvalue;
        format?: number[];
        masked?: boolean;
        size?: FluidSize;
        round?: boolean;
        label?: string;
        value?: string;
        error?: FluidError;
        onChange?: (value: string) => void;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'type'>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const refs = useRef<(HTMLInputElement | null)[]>([]);

    const length = format.reduce((len, val) => len + val, 0);
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

    return <div {...rest}
        className={classes(
            style.wrapper,
            style[`s__${size}`],
            round && style.round,
            props.className
        )}>
        {label && <div id={id} className={style.label}>{label}{props.required ? ' *' : ''}</div>}

        <div className={style.pincode} data-error={!!error} data-disabled={props.disabled}>
            {format.map((count, i) => {
                const min = format.slice(0, i).reduce((len, val) => len + val, 0);

                return <div key={i} className={style.group}>
                    {new Array(count).fill(0).map((_, i) => {
                        i += min;

                        return <div key={i} className={style.field}>
                            <input ref={el => {
                                refs.current[i] = el;
                            }}
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
        </div>

        <input {...split} type="hidden" aria-labelledby={label ? id : undefined} value={state} />
    </div>;
}