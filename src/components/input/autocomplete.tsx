'use client';

import { useEffect, forwardRef, useRef, useState } from 'react';
import Field, { FieldProps } from "./field";
import { FluidInputvalue, PopoverRootReference } from '../../../src/types';
import { Combobox } from '../display';
import { changeInputValue } from '../../core/utils';

const Autocomplete = forwardRef(({ cc = {}, completions, emptyMessage, value, defaultValue, onChange, ...props }: {
    completions: string[] | { label: string; value: string; }[];
    emptyMessage?: string;
} & FieldProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const field = useRef<HTMLInputElement>(null);
    const popover = useRef<PopoverRootReference>(null);
    const focus = useRef(false);

    const [state, setState] = value !== undefined ? [value] : useState<FluidInputvalue>(defaultValue || '');

    useEffect(() => {
        if (focus.current) popover.current?.[completions.length ? 'open' : 'close']();
    }, [completions]);

    return <Combobox.Root ref={popover} stretch onClose={() => focus.current = false}>
        <Combobox.Trigger disabled>
            <Field
                ref={ref}
                inputRef={field}
                {...props}
                aria-haspopup="listbox"
                aria-autocomplete="list"
                value={state}
                onChange={e => {
                    onChange?.(e);
                    setState?.(e.target.value);
                }}
                onFocus={e => {
                    props.onFocus?.(e);

                    focus.current = true;
                    if (completions.length) popover.current?.open();
                }} />
        </Combobox.Trigger>

        <Combobox.Content autoFocus={false} emptyMessage={emptyMessage}>
            {completions.map(entry => {
                const { label, value } = typeof entry === 'string' ? { label: entry, value: entry } : entry;

                return <Combobox.Option key={value} value={value} onSelect={val => {
                    if (!field.current) return;

                    changeInputValue(field.current, val);
                    field.current.focus();
                }}>
                    {label}
                </Combobox.Option>;
            })}
        </Combobox.Content>
    </Combobox.Root>;
});

Autocomplete.displayName = 'Autocomplete';

export default Autocomplete;