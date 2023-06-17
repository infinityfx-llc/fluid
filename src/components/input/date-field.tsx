'use client';

import { forwardRef, useState } from 'react';
import Field, { FieldProps } from './field';
import useStyles from '@/src/hooks/use-styles';
import { Animatable } from '@infinityfx/lively';
import { Move } from '@infinityfx/lively/animations';
import Calendar from './calendar';
import Popover from '../layout/popover';

const DateField = forwardRef(({ styles = {}, value, defaultValue = new Date(), onChange, disabled, ...props }:
    {
        value?: Date;
        defaultValue?: Date;
        onChange?: (value: Date) => void;
        disabled?: boolean | Date[];
    } & Omit<FieldProps, 'disabled' | 'value' | 'defaultValue' | 'onChange'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.calendar': {
            boxShadow: '0 0 8px rgb(0, 0, 0, .06)',
            border: 'solid 1px var(--f-clr-grey-100)',
            backgroundColor: 'var(--f-clr-bg-100)'
        }
    });

    const [state, setState] = value !== undefined ? [value] : useState(defaultValue);
    const [partial, setPartial] = useState<string | null>(null);

    function toString(date: Date) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }

    function format(value: string) {
        const nums = value.replace(/\D/g, '');

        return [nums.slice(0, 4), nums.slice(4, 6), nums.slice(6, 8)].filter(val => val.length).join('-');
    }

    return <Popover.Root position="center">
        <Popover.Trigger disabled={disabled === true || props.readOnly}>
            <Field ref={ref} {...props}
                role="combobox"
                aria-haspopup="listbox"
                aria-disabled={props.readOnly || disabled === true || false}
                type="text"
                disabled={disabled === true}
                value={partial !== null ? partial : toString(state)}
                onChange={e => {
                    setPartial(format(e.target.value));
                }}
                onBlur={() => {
                    if (partial) {
                        const date = new Date(partial);
                        if (!isNaN(date.getTime())) {
                            setState?.(date);
                            onChange?.(date);
                        }
                    }

                    setPartial(null);
                }}
            />
        </Popover.Trigger>

        <Popover.Content role="listbox" aria-multiselectable={false}>
            <Animatable key="date-field-calendar" animate={Move.unique({ duration: .2 })} unmount triggers={[{ on: 'mount' }]}>
                <Calendar
                    className={style.calendar}
                    round={props.round}
                    size={props.size}
                    disabled={disabled}
                    value={state}
                    onChange={date => {
                        setState?.(date);
                        onChange?.(date);
                    }} />
            </Animatable>
        </Popover.Content>
    </Popover.Root>
});

DateField.displayName = 'DateField';

export default DateField;