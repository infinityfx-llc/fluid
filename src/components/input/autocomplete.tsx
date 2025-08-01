'use client';

import { useEffect, useRef, useState } from 'react';
import Field, { FieldProps } from "./field";
import { FluidInputvalue, FluidSize, PopoverRootReference } from '../../../src/types';
import Combobox from '../display/combobox';
import { changeInputValue } from '../../core/utils';

/**
 * A text input which shows autocomplete suggestions.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/autocomplete}
 */
export default function Autocomplete({ completions, emptyMessage = 'No suggestions', value, defaultValue, onChange, contentSize, virtualItemHeight, ...props }: {
    completions: string[] | { label: string; value: string; }[];
    /**
     * The text to show when there are no completions to show.
     * 
     * @default "No suggestions"
     */
    emptyMessage?: string;
    contentSize?: FluidSize;
    /**
     * When set to a `number` greater than `0`, will enable virtual scrolling, improving performance for large numbers of entries.
     */
    virtualItemHeight?: number;
} & FieldProps) {
    const field = useRef<HTMLInputElement>(null);
    const popover = useRef<PopoverRootReference>(null);
    const focus = useRef(0);

    const [state, setState] = value !== undefined ? [value] : useState<FluidInputvalue>(defaultValue || '');

    useEffect(() => {
        // show suggestions when they are available and field has focus
        if (focus.current) popover.current?.[completions.length ? 'open' : 'close']();
    }, [completions]);

    return <Combobox.Root
        ref={popover}
        stretch
        onClose={() => {
            if (focus.current < 2) focus.current = 0;
        }}>
        <Combobox.Trigger disabled>
            <Field
                {...props}
                inputRef={field}
                aria-haspopup="listbox"
                aria-autocomplete="list"
                value={state}
                onChange={e => {
                    onChange?.(e);
                    setState?.(e.target.value);
                }}
                onBlur={e => {
                    props.onBlur?.(e);

                    focus.current = 1;
                }}
                onFocus={e => {
                    props.onFocus?.(e);

                    focus.current = 2;
                    if (completions.length) popover.current?.open();
                }} />
        </Combobox.Trigger>

        <Combobox.Content
            size={contentSize}
            round={props.round}
            autoFocus={false}
            emptyMessage={emptyMessage}
            virtualItemHeight={virtualItemHeight}>
            {completions.map(entry => {
                const { label, value } = typeof entry === 'string' ? { label: entry, value: entry } : entry;

                return <Combobox.Option
                    key={value}
                    value={value}
                    onSelect={val => {
                        if (!field.current) return;

                        changeInputValue(field.current, val);
                        field.current.focus();
                    }}>
                    {label}
                </Combobox.Option>;
            })}
        </Combobox.Content>
    </Combobox.Root>;
}