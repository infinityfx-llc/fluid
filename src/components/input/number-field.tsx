import { useCallback, useState, forwardRef } from 'react';
import Field, { FieldProps } from "./field";
import { MdAdd, MdRemove } from 'react-icons/md';
import Button from './button';
import { round, toNumber } from '@/src/core/utils';
import { FluidInputvalue } from '@/src/types';

const NumberField = forwardRef(({ children, styles = {}, precision = 3, controls = true, ...props }: { precision?: number; controls?: boolean; } & Omit<FieldProps, 'type'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const [value, setValue] = props.value !== undefined ? [props.value] : useState<FluidInputvalue>(children || '');

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

        return num === undefined ? value : round(num, precision).toString();
    }, [precision]);

    const buttonStyles = {
        ...styles,
        '.button': {
            borderRadius: 0,
            alignSelf: 'stretch'
        }
    };

    return <Field ref={ref} {...props} type="number" value={value}
        onChange={e => {
            setValue?.(format(e.target.value));
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
        left={controls ? <Button variant="minimal" size={props.size} disabled={props.disabled} styles={buttonStyles} onClick={() => {
            setValue?.(format(value, -step));
            // call onChange event!!
        }}>
            <MdRemove />
        </Button> : null}
        right={controls ? <Button variant="minimal" size={props.size} disabled={props.disabled} styles={buttonStyles} onClick={() => {
            setValue?.(format(value, step));
        }}>
            <MdAdd />
        </Button> : null} />;
});

NumberField.displayName = 'NumberField';

export default NumberField;