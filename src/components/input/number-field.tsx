'use client';

import { useCallback, useState, forwardRef, useRef } from 'react';
import Field, { FieldProps } from "./field";
import { MdAdd, MdRemove } from 'react-icons/md';
import Button from './button';
import { changeInputValue, combineClasses, round, toNumber } from '../../../src/core/utils';
import { FluidInputvalue } from '../../../src/types';
import { createStyles } from '../../core/style';

const NumberField = forwardRef(({ cc = {}, precision = 3, controls = true, defaultValue, ...props }: { precision?: number; controls?: boolean; } & Omit<FieldProps, 'type'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('number-field', {
        '.button': {
            borderRadius: '0 !important',
            alignSelf: 'stretch !important'
        },

        '.input': {
            MozAppearance: 'textfield'
        },

        '.input::-webkit-outer-spin-button, .input::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0
        }
    });
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
    }, [precision]);

    function increment(amount: number) {
        if (inputRef.current) changeInputValue(inputRef.current, format(value, amount));
    }

    return <Field ref={ref} inputRef={inputRef} {...props} type="number" value={value}
        onChange={e => {
            e.target.value = format(e.target.value); // maybe only do on blur??
            setValue?.(e.target.value);

            props.onChange?.(e);
        }}
        cc={{
            input: style.input
        }}
        left={controls ? <Button aria-label="Decrement" variant="minimal" size={props.size} disabled={props.disabled} cc={{ button: style.button }} onClick={() => increment(-step)}>
            <MdRemove />
        </Button> : null}
        right={controls ? <Button aria-label="Increment" variant="minimal" size={props.size} disabled={props.disabled} cc={{ button: style.button }} onClick={() => increment(step)}>
            <MdAdd />
        </Button> : null} />;
});

NumberField.displayName = 'NumberField';

export default NumberField;