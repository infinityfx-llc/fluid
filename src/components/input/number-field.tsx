'use client';

import { useCallback, useState, forwardRef, useRef } from 'react';
import Field, { FieldProps } from "./field";
import { MdAdd, MdRemove } from 'react-icons/md';
import Button from './button';
import { round, toNumber } from '../../../src/core/utils';
import { FluidInputvalue } from '../../../src/types';

const NumberField = forwardRef(({ styles = {}, precision = 3, controls = true, defaultValue, ...props }: { precision?: number; controls?: boolean; } & Omit<FieldProps, 'type'>, ref: React.ForwardedRef<HTMLDivElement>) => {
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
    }, [precision]);

    const buttonStyles = {
        ...styles,
        '.button': {
            borderRadius: 0,
            alignSelf: 'stretch'
        }
    };

    function increment(amount: number) {
        if (inputRef.current) {
            Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set?.call(inputRef.current, format(value, amount));
            inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    return <Field ref={ref} inputRef={inputRef} {...props} type="number" value={value}
        onChange={e => {
            e.target.value = format(e.target.value); // maybe only do on blur??
            setValue?.(e.target.value);

            props.onChange?.(e);
        }}
        styles={{
            ...styles,
            '.input': {
                MozAppearance: 'textfield'
            },

            '.input::-webkit-outer-spin-button, .input::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0
            }
        }}
        left={controls ? <Button variant="minimal" size={props.size} disabled={props.disabled} styles={buttonStyles} onClick={() => increment(-step)}>
            <MdRemove />
        </Button> : null}
        right={controls ? <Button variant="minimal" size={props.size} disabled={props.disabled} styles={buttonStyles} onClick={() => increment(step)}>
            <MdAdd />
        </Button> : null} />;
});

NumberField.displayName = 'NumberField';

export default NumberField;