'use client';

import { forwardRef, useRef, useState, useId, useEffect } from 'react';
import { FieldProps } from './field';
import Button from './button';
import { MdCheck, MdUnfoldMore } from 'react-icons/md';
import { FluidInputvalue, FluidStyles, PopoverRootReference, Selectors } from '../../../src/types';
import { classes, combineClasses, combineRefs } from '../../../src/core/utils';
import Badge from '../display/badge';
import Combobox from '../display/combobox';
import useInputProps from '../../../src/hooks/use-input-props';
import { createStyles } from '../../core/style';

export type SelectStyles = FluidStyles<'.wrapper' | '.label' | '.error' | '.field' | '.content' | '.placeholder' | '.badge'>;

type SelectProps<T> = {
    cc?: Selectors<'wrapper' | 'label' | 'error' | 'field' | 'content' | 'placeholder' | 'wrapper__xsm' | 'wrapper__sml' | 'wrapper__med' | 'wrapper__lrg' | 'wrapper__round' | 'badge'>;
    options: {
        label: string;
        value: FluidInputvalue;
        disabled?: boolean;
    }[];
    searchable?: boolean;
    limit?: number;
    emptyMessage?: string;
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
} & Omit<FieldProps, 'value' | 'defaultValue' | 'onChange' | 'onEnter'>;

function SelectComponent<T extends FluidInputvalue>(
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
        label,
        error,
        showError,
        icon,
        size = 'med',
        round,
        inputRef,
        ...props
    }: SelectProps<T>, ref: React.ForwardedRef<HTMLDivElement>) {
    const styles = createStyles('select', {
        '.wrapper': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xxs)',
            minWidth: 'clamp(0px, 12em, 100vw)'
        },

        '.label': {
            fontSize: '.8em',
            fontWeight: 500,
            color: 'var(--f-clr-text-100)'
        },

        '.error': {
            fontSize: '.8em',
            fontWeight: 500,
            color: 'var(--f-clr-error-100)'
        },

        '.field': {
            backgroundColor: 'var(--f-clr-fg-100)',
            border: 'solid 1px var(--f-clr-fg-200)',
            borderRadius: 'var(--f-radius-sml)',
            color: 'var(--f-clr-grey-200)',
            transition: 'border-color .2s, color .2s',
            display: 'flex',
            alignItems: 'center'
        },

        '.field:focus-within': {
            borderColor: 'var(--f-clr-primary-100)',
            color: 'var(--f-clr-primary-100)'
        },

        '.field[data-error="true"]': {
            borderColor: 'var(--f-clr-error-100)',
            color: 'var(--f-clr-error-200)'
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

        '.content_wrapper': {
            height: '2.64em',
            padding: '.6em',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xsm)',
            overflow: 'hidden',
            flexGrow: 1
        },

        '.content_wrapper > *:not(.content)': {
            flexShrink: 0
        },

        '.content': {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xsm)',
            flexGrow: 1,
            overflow: 'hidden',
            color: 'var(--f-clr-text-100)'
        },

        '.content::after': {
            content: '""',
            position: 'absolute',
            height: '100%',
            width: '16px',
            right: 0,
            background: 'linear-gradient(90deg, transparent, var(--f-clr-fg-100))'
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

        '.wrapper__xsm': {
            fontSize: 'var(--f-font-size-xxs)'
        },

        '.wrapper__sml': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.wrapper__med': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.wrapper__lrg': {
            fontSize: 'var(--f-font-size-med)'
        },

        '.wrapper__round .field': {
            borderRadius: '999px'
        },

        '.badge': {
            backgroundColor: 'var(--f-clr-fg-200) !important'
        },

        '.field[data-error="true"] .badge': {
            backgroundColor: 'var(--f-clr-error-400) !important'
        },

        '.field[data-disabled="true"] .badge': {
            backgroundColor: 'var(--f-clr-grey-200) !important'
        }
    });
    const style = combineClasses(styles, cc);

    const id = useId();
    const selfInputRef = useRef<HTMLInputElement>(null);
    const popover = useRef<PopoverRootReference>(null);
    const [state, setState] = value !== undefined ? [value] : useState<FluidInputvalue | FluidInputvalue[]>(defaultValue || (multiple ? [] : ''));
    const [split, rest] = useInputProps(props);

    useEffect(() => {
        if (value === undefined) setState?.(multiple ? [] : '');
    }, [multiple]);

    return <Combobox.Root ref={popover} stretch>
        <div ref={ref} {...rest} className={classes(
            style.wrapper,
            style[`wrapper__${size}`],
            round && style.wrapper__round,
            props.className
        )} aria-haspopup="listbox">
            {label && <div id={id} className={style.label}>{label}{props.required ? ' *' : ''}</div>}

            <Combobox.Trigger disabled={props.disabled || readOnly}>
                <div className={style.field} data-error={!!error} data-disabled={props.disabled}>
                    <div className={style.content_wrapper}>
                        {icon}

                        <div className={style.content}>
                            {!(Array.isArray(state) ? state.length : state) && <div className={style.placeholder}>{placeholder}</div>}

                            {Array.isArray(state) ?
                                (state.length < 3 ?
                                    state.map((val, i) => <Badge key={i} round={round} cc={{ badge: style.badge }}>{val}</Badge>) :
                                    <>
                                        <Badge round={round} cc={{ badge: style.badge }}>{state[0]}</Badge>
                                        <Badge round={round} cc={{ badge: style.badge }}>+{state.length - 1} more</Badge>
                                    </>
                                ) :
                                options.find(option => option.value === state)?.label // TESTING!!
                            }
                        </div>

                        <input ref={combineRefs(inputRef, selfInputRef)} {...split} value={state?.toString()} readOnly aria-labelledby={label ? id : undefined} aria-invalid={!!error} className={style.input} />
                    </div>

                    <Button aria-label={split['aria-label'] || label} round={round} size={size} disabled={props.disabled || readOnly} variant="minimal" style={{ marginRight: '.25em' }}>
                        <MdUnfoldMore />
                    </Button>
                </div>
            </Combobox.Trigger>

            {typeof error === 'string' && showError && error.length ? <div className={style.error}>{error}</div> : null}
        </div>

        <Combobox.Content aria-multiselectable={multiple} searchable={searchable} emptyMessage={emptyMessage}>
            {options.map(({ label, value, disabled }, i) => {
                const selected = (Array.isArray(state) ? state.includes(value) : state === value);

                return <Combobox.Option key={i} value={label} disabled={disabled} aria-selected={selected} onSelect={() => {
                    if (!Array.isArray(state)) {
                        popover.current?.close();
                        selfInputRef.current?.focus();

                        setState?.(value);
                        onChange?.(value as T);
                    } else {
                        const updated = state.slice();
                        const idx = updated.indexOf(value);
                        if (idx < 0) {
                            if (!limit || updated.length < limit) updated.push(value);
                        } else updated.splice(idx, 1);

                        setState?.(updated);
                        onChange?.(updated as any);
                    }
                }}>
                    {label}

                    {selected && <MdCheck style={{ marginLeft: 'auto' }} />}
                </Combobox.Option>;
            })}
        </Combobox.Content>
    </Combobox.Root>;
}

const Select = forwardRef(SelectComponent) as (<T extends FluidInputvalue | FluidInputvalue[]>(props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement>; }) => ReturnType<typeof SelectComponent>) & { displayName: string; };

Select.displayName = 'Select';

export default Select;