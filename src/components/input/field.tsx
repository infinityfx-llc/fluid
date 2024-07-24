'use client';

import { useMemo, useState } from 'react';
import { classes, combineClasses } from '../../../src/core/utils';
import useInputProps from '../../../src/hooks/use-input-props';
import { FluidInputvalue, FluidSize, Selectors } from '../../../src/types';
import { createStyles } from '../../core/style';

const styles = createStyles('field', {
    '.input': {
        border: 'none',
        background: 'none',
        outline: 'none',
        color: 'var(--f-clr-text-100)',
        width: 0,
        flexGrow: 1
    },

    '.input::placeholder': {
        color: 'var(--f-clr-grey-300)'
    },

    '.field': {
        backgroundColor: 'var(--f-clr-fg-100)',
        border: 'solid 1px var(--f-clr-fg-200)',
        borderRadius: 'var(--f-radius-sml)',
        color: 'var(--f-clr-grey-200)',
        transition: 'border-color .2s, color .2s, outline-color .2s',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        outline: 'solid 3px transparent',
        minWidth: 'min(var(--width, 100vw), 12em)'
    },

    '.content': {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xsm)',
        padding: '.675em',
        flexGrow: 1
    },

    '.field:focus-within': {
        borderColor: 'var(--f-clr-primary-100)',
        color: 'var(--f-clr-primary-100)',
        outlineColor: 'var(--f-clr-primary-500)'
    },

    '.field[data-error="true"]': {
        borderColor: 'var(--f-clr-error-100)'
    },

    '.field[data-error="true"]:focus-within': {
        outlineColor: 'var(--f-clr-error-400)'
    },

    '.field[data-error="true"] .content': {
        color: 'var(--f-clr-error-200)'
    },

    '.field[data-error="true"] .input': {
        color: 'var(--f-clr-error-200)'
    },

    '.field[data-disabled="true"]': {
        backgroundColor: 'var(--f-clr-grey-100)',
        borderColor: 'var(--f-clr-grey-200)'
    },

    '.field[data-disabled="true"] .input': {
        color: 'var(--f-clr-grey-500)'
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

    '.field.round': {
        borderRadius: '999px'
    }
});

export type FieldSelectors = Selectors<'input' | 'field' | 'content' | 's__xsm' | 's__sml' | 's__med' | 's__lrg' | 'round'>;

export type FieldProps = {
    ref?: React.Ref<HTMLDivElement>;
    inputRef?: React.Ref<HTMLInputElement>;
    cc?: FieldSelectors;
    defaultValue?: FluidInputvalue;
    round?: boolean;
    size?: FluidSize;
    icon?: React.ReactNode;
    left?: React.ReactNode;
    right?: React.ReactNode;
    onEnter?: () => void;
    error?: any;
    shape?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'defaultValue' | 'children'>;

export default function Field({ cc = {}, round = false, size = 'med', error, icon, left, right, onEnter, inputRef, shape, defaultValue, ...props }: FieldProps) {
    const style = combineClasses(styles, cc);

    const [split, rest] = useInputProps(props);
    const [value, setValue] = props.value !== undefined ? [props.value] : useState<FluidInputvalue>(defaultValue || '');

    const masks = useMemo(() => {
        return shape?.split('')
            .map(char => {
                if (/0/.test(char)) return /[0-9]/;
                if (/\*/.test(char)) return /[a-zA-Z0-9]/;

                return char;
            }) || [];
    }, [shape]);

    return <div
        {...rest}
        className={classes(
            style.field,
            style[`s__${size}`],
            round && style.round,
            props.className
        )}
        data-error={!!error}
        data-disabled={props.disabled}>
        {left}

        <label className={style.content}>
            {icon}

            <input
                {...split}
                ref={inputRef}
                value={value}
                onChange={e => {
                    let input = e.target.value.split(''),
                        output = '',
                        len = 0;

                    for (let i = 0, j = 0; i < input.length; i++) {
                        const char = input[i],
                            mask = masks[j];

                        if (!mask) {
                            if (j === 0) {
                                output = e.target.value;
                                len = output.length;
                            }

                            break;
                        }

                        if (typeof mask === 'string') {
                            output += mask;

                            if (mask !== char || i !== j) i--;
                        } else
                            if (mask.test(char)) {
                                output += char;
                                len = output.length;
                            } else {
                                break;
                            }

                        j++;
                    }

                    e.target.value = output.slice(0, len);
                    setValue?.(e.target.value);

                    props.onChange?.(e);
                }}
                className={style.input}
                aria-invalid={!!error}
                onKeyDown={e => {
                    if (e.key === 'Enter') onEnter?.();
                }} />
        </label>

        {right}
    </div>;
}