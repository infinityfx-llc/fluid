'use client';

import { useCallback, useState, useRef } from 'react';
import Field, { FieldProps } from "./field";
import Button from './button';
import { changeInputValue, combineClasses, combineRefs, round, toNumber } from '../../../src/core/utils';
import { FluidInputvalue } from '../../../src/types';
import { createStyles } from '../../core/style';
import { Icon } from '../../core/icons';

const styles = createStyles('number-field', {
    '.field .button__start': {
        marginLeft: '.25em',
        background: 'var(--f-clr-bg-100)',
        color: 'var(--f-clr-text-100)'
    },

    '.field .button__end': {
        marginRight: '.25em',
        background: 'var(--f-clr-bg-100)',
        color: 'var(--f-clr-text-100)'
    },

    '.input': {
        MozAppearance: 'textfield'
    },

    '.input::-webkit-outer-spin-button, .input::-webkit-inner-spin-button': {
        WebkitAppearance: 'none',
        margin: 0
    }
});

/**
 * An input used for entering numerical values.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/number-field}
 */
export default function NumberField({ cc = {}, precision = 3, controls = true, defaultValue, ...props }: {
    /**
     * Maximum number of digits to allow after the decimal.
     * 
     * @default 3
     */
    precision?: number;
    /**
     * Show increment/decrement controls on the sides of the input field.
     * 
     * @default true
     */
    controls?: boolean;
} & Omit<FieldProps, 'type'>) {
    const style = combineClasses(styles, cc);

    const [value, setValue] = props.value !== undefined ? [props.value] : useState<FluidInputvalue>(defaultValue || '');

    const inputRef = useRef<HTMLInputElement>(null);
    const step = toNumber(props.step, 1);
    const min = toNumber(props.min, -Number.MAX_VALUE);
    const max = toNumber(props.max, Number.MAX_VALUE);

    // format a string as a valid number, adhering to the min, max and precision requirements
    const format = useCallback((value: FluidInputvalue, increment?: number) => {
        let num = value ? parseFloat(value.toString()) : undefined;
        if (increment !== undefined) {
            num = (num || 0) + increment;
        }
        if (num !== undefined) {
            num = Math.max(num, min);
            num = Math.min(num, max);
        }

        return num === undefined ? '' : round(num, precision).toString();
    }, [precision, min, max]);

    function increment(amount: number) {
        if (inputRef.current) changeInputValue(inputRef.current, format(value, amount));
    }

    const buttonProps = {
        compact: true,
        size: props.size,
        disabled: props.disabled,
        round: props.round
    };

    return <Field {...props}
        inputRef={combineRefs(inputRef, props.inputRef)}
        type="number"
        value={value}
        onChange={e => {
            setValue?.(e.target.value);

            props.onChange?.(e);
        }}
        onBlur={e => {
            e.target.value = format(e.target.value);
            setValue?.(e.target.value);

            props.onChange?.(e);
            props.onBlur?.(e);
        }}
        cc={{
            field: style.field,
            input: style.input,
            ...cc
        }}
        left={controls ? <Button {...buttonProps} cc={{ button: style.button__start }} aria-label={`-${step}`} onClick={() => increment(-step)}>
            <Icon type="remove" />
        </Button> : null}
        right={controls ? <Button {...buttonProps} cc={{ button: style.button__end }} aria-label={`+${step}`} onClick={() => increment(step)}>
            <Icon type="add" />
        </Button> : null} />;
}