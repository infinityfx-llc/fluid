'use client';

import { useCallback, useState, forwardRef, useRef } from 'react';
import Field, { FieldProps } from "./field";
import Button from './button';
import { changeInputValue, combineClasses, combineRefs, round, toNumber } from '../../../src/core/utils';
import { FluidInputvalue } from '../../../src/types';
import { createStyles } from '../../core/style';
import { Icon } from '../../core/icons';

const styles = createStyles('number-field', {
    '.wrapper .button__start': {
        marginLeft: '.3em',
        backgroundColor: 'var(--f-clr-bg-100)',
        color: 'var(--f-clr-text-100)'
    },

    '.wrapper .button__end': {
        marginRight: '.3em',
        backgroundColor: 'var(--f-clr-bg-100)',
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

const NumberField = forwardRef(({ cc = {}, precision = 3, controls = true, defaultValue, ...props }: {
    precision?: number;
    controls?: boolean;
} & Omit<FieldProps, 'type'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = combineClasses(styles, cc);

    const [value, setValue] = props.value !== undefined ? [props.value] : useState<FluidInputvalue>(defaultValue || '');

    const inputRef = useRef<HTMLInputElement | null>(null);
    const step = toNumber(props.step, 1);
    const min = toNumber(props.min, -Number.MAX_VALUE);
    const max = toNumber(props.max, Number.MAX_VALUE);

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
        disabled: props.disabled
    };

    return <Field ref={ref} {...props}
        inputRef={combineRefs(inputRef, props.inputRef)}
        type="number"
        value={value}
        onChange={e => {
            e.target.value = format(e.target.value); // maybe only do on blur??
            setValue?.(e.target.value);

            props.onChange?.(e);
        }}
        cc={{
            wrapper: style.wrapper,
            input: style.input,
            ...cc
        }}
        left={controls ? <Button {...buttonProps} cc={{ button: style.button__start }} aria-label="Decrement" onClick={() => increment(-step)}>
            <Icon type="remove" />
        </Button> : null}
        right={controls ? <Button {...buttonProps} cc={{ button: style.button__end }} aria-label="Increment" onClick={() => increment(step)}>
            <Icon type="add" />
        </Button> : null} />;
});

NumberField.displayName = 'NumberField';

export default NumberField;