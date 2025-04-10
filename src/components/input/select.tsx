'use client';

import { useRef, useState, useEffect, useId } from 'react';
import { FieldProps } from './field';
import Button from './button';
import { FluidInputvalue, FluidSize, PopoverRootReference, Selectors } from '../../../src/types';
import { classes, combineClasses, combineRefs } from '../../../src/core/utils';
import Badge from '../display/badge';
import Combobox from '../display/combobox';
import useInputProps from '../../../src/hooks/use-input-props';
import { createStyles } from '../../core/style';
import { Icon } from '../../core/icons';

const styles = createStyles('select', {
    '.field': {
        backgroundColor: 'var(--f-clr-bg-200)',
        borderRadius: 'var(--f-radius-sml)',
        color: 'var(--f-clr-grey-200)',
        transition: 'background-color .2s, border-color .2s, color .2s, outline-color .2s',
        display: 'flex',
        alignItems: 'center',
        minWidth: 'min(var(--width, 100vw), 12em)',
        outline: 'solid 3px transparent'
    },

    '.v__default': {
        border: 'solid 1px var(--f-clr-fg-200)'
    },

    '.v__minimal': {
        backgroundColor: 'var(--f-clr-bg-200)'
    },

    '.v__default:focus-within': {
        borderColor: 'var(--f-clr-primary-100)',
        color: 'var(--f-clr-primary-100)',
        outlineColor: 'var(--f-clr-primary-500)'
    },

    '.v__minimal:focus-within': {
        backgroundColor: 'var(--f-clr-fg-100)'
    },

    '.field[data-error="true"]': {
        borderColor: 'var(--f-clr-error-100)',
        color: 'var(--f-clr-error-200)'
    },

    '.field[data-error="true"]:focus-within': {
        outlineColor: 'var(--f-clr-error-400)'
    },

    '.field[data-error="true"] .content': {
        color: 'var(--f-clr-error-200)'
    },

    '.field[data-disabled="true"]': {
        backgroundColor: 'var(--f-clr-grey-100)',
        borderColor: 'var(--f-clr-grey-200)'
    },

    '.field[data-disabled="true"] .content': {
        color: 'var(--f-clr-grey-500)'
    },

    '.content__wrapper': {
        padding: '.675em',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xsm)',
        overflow: 'hidden',
        flexGrow: 1
    },

    '.content__wrapper > *:not(.content)': {
        flexShrink: 0
    },

    '.content': {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xsm)',
        flexGrow: 1,
        overflow: 'hidden',
        color: 'var(--f-clr-text-100)',
        minHeight: '1.375em'
    },

    '.content > *': {
        flexShrink: 0
    },

    '.placeholder': {
        color: 'var(--f-clr-grey-300)'
    },

    '.input': {
        position: 'absolute',
        opacity: 0,
        width: 0
    },

    '.s__xsm': {
        fontSize: 'var(--f-font-size-xxs)'
    },

    '.s__sml': {
        fontSize: 'var(--f-font-size-xsm)'
    },

    '.s__med': {
        fontSize: 'var(--f-font-size-sml)'
    },

    '.s__lrg': {
        fontSize: 'var(--f-font-size-med)'
    },

    '.field.round': {
        borderRadius: '999px'
    },

    '.field .badge': {
        backgroundColor: 'var(--f-clr-fg-100)'
    },

    '.field[data-error="true"] .badge': {
        backgroundColor: 'var(--f-clr-error-400)'
    },

    '.field[data-disabled="true"] .badge': {
        backgroundColor: 'var(--f-clr-grey-200)'
    },

    '.icon': {
        display: 'flex',
        marginLeft: 'auto'
    }
});

export type SelectSelectors = Selectors<'field' | 'content' | 'placeholder' | 's__xsm' | 's__sml' | 's__med' | 's__lrg' | 'round' | 'badge' | 'icon'>;

type SelectProps<T> = {
    cc?: SelectSelectors;
    options: {
        label: React.ReactNode;
        value: FluidInputvalue;
        key?: string;
        disabled?: boolean;
    }[];
    searchable?: boolean;
    limit?: number;
    emptyMessage?: string;
    value?: T | null;
    defaultValue?: T;
    onChange?: (value: T) => void;
    contentSize?: FluidSize;
    mobileContainer?: 'popover' | 'modal';
    virtualItemHeight?: number;
} & Omit<FieldProps, 'value' | 'defaultValue' | 'onChange' | 'onEnter' | 'left' | 'right' | 'shape'>;

/**
 * Displays a list of selectable options.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/select}
 */
export default function Select<T extends FluidInputvalue | FluidInputvalue[]>(
    {
        cc = {},
        options,
        multiple = false,
        searchable,
        limit,
        emptyMessage = 'Nothing found',
        placeholder,
        value,
        defaultValue,
        onChange,
        readOnly,
        error,
        icon,
        size = 'med',
        variant = 'default',
        contentSize,
        round,
        inputRef,
        mobileContainer,
        virtualItemHeight,
        ...props
    }: SelectProps<T>) {
    const style = combineClasses(styles, cc);

    const placeholderId = useId();
    const selfInputRef = useRef<HTMLInputElement>(null);
    const popover = useRef<PopoverRootReference>(null);
    const [split, rest] = useInputProps(props);

    const [state, setState] = value !== undefined ? [value, onChange] : useState<T>(defaultValue || (multiple ? [] as any : '' as T));
    const isMult = Array.isArray(state);

    useEffect(() => {
        if (multiple !== isMult) setState?.(multiple ?
            (state ? [state] : []) :
            (state as any)[0]);
    }, [multiple, isMult]);

    return <Combobox.Root
        ref={popover}
        stretch
        mobileContainer={mobileContainer}>
        <Combobox.Trigger disabled={props.disabled || readOnly}>
            <div
                {...rest}
                aria-haspopup="listbox"
                className={classes(
                    style.field,
                    style[`s__${size}`],
                    style[`v__${variant}`],
                    round && style.round,
                    props.className
                )}
                data-error={!!error}
                data-disabled={props.disabled}>
                <div className={style.content__wrapper}>
                    {icon}

                    <div className={style.content}>
                        {(isMult ? !state.length : state === null || state === undefined || state === '') && <div className={style.placeholder} id={placeholderId}>{placeholder}</div>}

                        {isMult ?
                            (state.length < 3 ?
                                state.map((val, i) => <Badge key={i} round={round} cc={{ badge: style.badge }}>{val}</Badge>) :
                                <>
                                    <Badge round={round} cc={{ badge: style.badge }}>{state[0]}</Badge>
                                    <Badge round={round} cc={{ badge: style.badge }}>+{state.length - 1} more</Badge>
                                </>
                            ) :
                            options.find(option => option.value === state)?.label // Optimze?
                        }
                    </div>

                    <input
                        aria-labelledby={placeholder ? placeholderId : undefined}
                        {...split}
                        ref={combineRefs(inputRef, selfInputRef)}
                        readOnly
                        className={style.input}
                        value={state?.toString()}
                        aria-invalid={!!error} />
                </div>

                <Button compact aria-label={split['aria-label']} aria-labelledby={split['aria-labelledby']} round={round} size={size} disabled={props.disabled || readOnly} variant="minimal" style={{
                    marginRight: '.2em'
                }}>
                    <Icon type="expand" />
                </Button>
            </div>
        </Combobox.Trigger>

        <Combobox.Content
            round={round}
            size={contentSize}
            aria-multiselectable={multiple}
            searchable={searchable}
            emptyMessage={emptyMessage}
            virtualItemHeight={virtualItemHeight}>
            {options.map(({ label, value, key, disabled }) => {
                const selected = isMult ? state.includes(value) : state === value;

                return <Combobox.Option
                    key={'' + value}
                    value={key || ('' + label)}
                    disabled={disabled}
                    aria-selected={selected}
                    onSelect={() => {
                        // select or deselect this option

                        if (!isMult) {
                            // if only one selection is allowed replace currently selected option
                            popover.current?.close();
                            selfInputRef.current?.focus();

                            setState?.(value as any);
                        } else {
                            // if multiple selections are allowed add or remove this option from the selected options
                            const updated = state.slice();
                            const idx = updated.indexOf(value);
                            if (idx < 0) {
                                if (!limit || updated.length < limit) updated.push(value);
                            } else updated.splice(idx, 1);

                            setState?.(updated as any);
                        }
                    }}>
                    {label}

                    {selected && <div className={style.icon}>
                        <Icon type="check" />
                    </div>}
                </Combobox.Option>;
            })}
        </Combobox.Content>
    </Combobox.Root>;
}