'use client';

import { forwardRef, useState } from 'react';
import Field, { FieldProps } from './field';
import { Animatable } from '@infinityfx/lively';
import { Move } from '@infinityfx/lively/animations';
import Popover from '../layout/popover';
import { createStyles } from '../../core/style';
import { combineClasses, isControlled } from '../../core/utils';
import ColorPicker, { parsePartialHex } from './color-picker';
import { Swatch } from '../display';

const ColorField = forwardRef(({ cc = {}, value, defaultValue, onChange, disabled, ...props }:
    {
        value?: string;
        defaultValue?: string;
        onChange?: (value: string) => void;
        disabled?: boolean;
    } & Omit<FieldProps, 'disabled' | 'value' | 'defaultValue' | 'onChange'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('color-field', {
        '.picker': {
            boxShadow: 'var(--f-shadow-med)',
            backgroundColor: 'var(--f-clr-fg-100)',
            border: 'solid 1px var(--f-clr-fg-200)',
            padding: 'var(--f-spacing-sml)',
            borderRadius: 'var(--f-radius-sml)'
        }
    });
    const style = combineClasses(styles, cc);

    const [state, setState] = isControlled({ value, onChange }) ? [value, onChange] : useState(defaultValue);
    const [partial, setPartial] = useState<string | null>(null);

    function update(value: string) {
        value = `#${value}`;

        setState?.(value);
    }

    return <Popover.Root position="center">
        <Popover.Trigger disabled={disabled}>
            <Field ref={ref} {...props}
                left={<Swatch size={props.size} round={props.round} color={state} style={{ marginLeft: '.25em' }} />}
                role="combobox"
                aria-haspopup="listbox"
                type="text"
                disabled={disabled}
                aria-disabled={props.readOnly || disabled}
                value={partial !== null ? partial : state}
                onChange={e => {
                    const hex = parsePartialHex(e.target.value);

                    setPartial(e.target.value);
                    update(hex);
                }}
                onBlur={() => setPartial(null)}
            />
        </Popover.Trigger>

        <Popover.Content role="listbox" aria-multiselectable={false}>
            <Animatable id="date-field-calendar" animate={Move.unique({ duration: .2 })} triggers={[{ on: 'mount' }, { on: 'unmount', reverse: true }]}>
                <div className={style.picker}>
                    <ColorPicker value={state?.replace('#', '')} onChange={update} disabled={props.readOnly || disabled} />
                </div>
            </Animatable>
        </Popover.Content>
    </Popover.Root>
});

ColorField.displayName = 'ColorField';

export default ColorField;