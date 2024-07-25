'use client';

import { useState } from 'react';
import Field, { FieldProps } from './field';
import { Animatable } from '@infinityfx/lively';
import Calendar from './calendar';
import Popover from '../layout/popover';
import { createStyles } from '../../core/style';
import { combineClasses } from '../../core/utils';
import Button from './button';
import { Icon } from '../../core/icons';

// format a date in yyyy-mm-dd format
function toString(date?: Date | null) {
    if (!date) return '';

    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

// format a string in yyyy-mm-dd format
function format(value: string) {
    const nums = value.replace(/\D/g, '');

    return [nums.slice(0, 4), nums.slice(4, 6), nums.slice(6, 8)].filter(val => val.length).join('-');
}

const styles = createStyles('date-field', fluid => ({
    [`@media(min-width: ${fluid.breakpoints.mob + 1}px)`]: {
        '.calendar': {
            boxShadow: 'var(--f-shadow-med)',
            border: 'solid 1px var(--f-clr-fg-200)'
        }
    }
}));

/**
 * An input used for entering dates.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/date-field}
 */
export default function DateField({ cc = {}, value, defaultValue, onChange, disabled, clearable, ...props }:
    {
        value?: Date | null;
        defaultValue?: Date;
        onChange?: (value: Date | null) => void;
        disabled?: boolean | Date[];
        clearable?: boolean;
    } & Omit<FieldProps, 'disabled' | 'value' | 'defaultValue' | 'onChange'>) {
    const style = combineClasses(styles, cc);

    const [state, setState] = value !== undefined ? [value, onChange] : useState<Date | null>(defaultValue || null);
    const [partial, setPartial] = useState<string | null>(null);

    return <Popover.Root position="center" mobileContainer="modal">
        <Popover.Trigger disabled={disabled === true || props.readOnly}>
            <Field {...props}
                cc={cc}
                inputMode="none"
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
                        if (!isNaN(date.getTime())) setState?.(date);
                    }

                    setPartial(null);
                }}
                right={clearable && <Button
                    compact
                    aria-label="Clear date"
                    round={props.round}
                    size={props.size}
                    disabled={disabled === true || props.readOnly}
                    variant="minimal"
                    style={{
                        marginRight: '.2em'
                    }}
                    onClick={() => setState?.(null)}>
                    <Icon type="close" />
                </Button>}
            />
        </Popover.Trigger>

        <Popover.Content role="listbox">
            <Animatable
                id="date-field-calendar"
                animate={{
                    opacity: [0, .2, 1],
                    scale: [.9, 1],
                    duration: .2
                }}
                triggers={[
                    { on: 'mount' },
                    { on: 'unmount', reverse: true }
                ]}>

                <Calendar
                    className={style.calendar}
                    round={props.round}
                    size={props.size}
                    disabled={disabled}
                    value={state}
                    onChange={date => setState?.(date)} />
            </Animatable>
        </Popover.Content>
    </Popover.Root>
}