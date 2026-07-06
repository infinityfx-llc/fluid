'use client';

import { useState } from 'react';
import Field, { FieldProps } from './field';
import { Animate } from '@infinityfx/lively';
import { PopoverRoot, PopoverContent, PopoverTrigger } from '../layout/popover';
import { createStyles } from '../../core/style';
import { combineClasses, hexToRgb, rgbToHex } from '../../core/utils';
import ColorPicker from './color-picker';
import Swatch from '../display/swatch';

function parsePartialHex(str: string) {
    return `#${rgbToHex(hexToRgb(str.replace(/[^\da-f]/g, '').slice(0, 6)))}`;
}

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
            backgroundColor: 'var(--f-clr-surface-100)',
            border: 'solid 1px var(--f-clr-surface-200)',
            borderRadius: 'var(--f-radius-med)'
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

    return <PopoverRoot position="center" mobileContainer="modal">
        <PopoverTrigger disabled={disabled}>
            <Field {...props}
                cc={cc}
                inputMode="none"
                left={<Swatch size={props.size} round={props.round} color={state} cc={{ ...cc, swatch: style.swatch }} />}
                role="combobox"
                aria-haspopup="listbox"
                type="text"
                disabled={disabled}
                aria-disabled={props.readOnly || disabled}
                value={partial !== null ? partial : state}
                onChange={e => {
                    const hex = parsePartialHex(e.target.value);

                    setPartial(e.target.value);
                    setState?.(hex);
                }}
                onBlur={() => setPartial(null)}
            />
        </PopoverTrigger>

        <PopoverContent role="listbox" aria-multiselectable={false}>
            <Animate
                correction="none"
                key="date-field-calendar"
                animate={{
                    opacity: [0, .2, 1],
                    scale: [.9, 1],
                    duration: .2
                }}
                triggers={{
                    animate: ['mount', { on: 'unmount', reverse: true }]
                }}>

                <div className={style.picker}>
                    <ColorPicker value={state} onChange={hex => setState?.(`#${hex}`)} disabled={props.readOnly || disabled} />
                </div>
            </Animate>
        </PopoverContent>
    </PopoverRoot>;
}