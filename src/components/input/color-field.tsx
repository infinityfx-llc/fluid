'use client';

import { useState } from 'react';
import Field, { FieldProps } from './field';
import { Animatable } from '@infinityfx/lively';
import Popover from '../layout/popover';
import { createStyles } from '../../core/style';
import { combineClasses } from '../../core/utils';
import ColorPicker from './color-picker';
import { parsePartialHex } from './color-picker';
import Swatch from '../display/swatch';

const styles = createStyles('color-field', fluid => ({
    '.picker': {
        padding: 'var(--f-spacing-sml)'
    },

    '.swatch': {
        marginLeft: '.4em'
    },

    [`@media(min-width: ${fluid.breakpoints.mob + 1}px)`]: {
        '.picker': {
            boxShadow: 'var(--f-shadow-med)',
            backgroundColor: 'var(--f-clr-fg-100)',
            border: 'solid 1px var(--f-clr-fg-200)',
            borderRadius: 'var(--f-radius-sml)'
        }
    }
}));

/**
 * An input field which displays a color picker.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/color-field}
 */
export default function ColorField({ cc = {}, value, defaultValue, onChange, disabled, ...props }:
    {
        value?: string;
        defaultValue?: string;
        onChange?: (value: string) => void;
        disabled?: boolean;
    } & Omit<FieldProps, 'disabled' | 'value' | 'defaultValue' | 'onChange'>) {
    const style = combineClasses(styles, cc);

    const [state, setState] = value !== undefined ? [value, onChange] : useState(defaultValue || '');
    const [partial, setPartial] = useState<string | null>(null);

    function update(value: string) {
        value = `#${value}`;

        setState?.(value);
    }

    return <Popover.Root position="center" mobileContainer="modal">
        <Popover.Trigger disabled={disabled}>
            <Field {...props}
                cc={cc}
                inputMode="none"
                left={<Swatch size={props.size} round={props.round} color={state} cc={{ swatch: style.swatch, ...cc }} />}
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
                    
                <div className={style.picker}>
                    <ColorPicker value={state?.replace('#', '')} onChange={update} disabled={props.readOnly || disabled} />
                </div>
            </Animatable>
        </Popover.Content>
    </Popover.Root>
}