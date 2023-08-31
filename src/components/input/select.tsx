'use client';

import { forwardRef, useRef, useState, useId } from 'react';
import { FieldProps } from './field';
import Button from './button';
import { MdCheck, MdUnfoldMore } from 'react-icons/md';
import { FluidInputvalue, FluidStyles, PopoverRootReference } from '../../../src/types';
import { classes } from '../../../src/core/utils';
import Badge from '../display/badge';
import Combobox from '../display/combobox';
import useInputProps from '../../../src/hooks/use-input-props';
import { useStyles } from '../../../src/hooks';

export type SelectStyles = FluidStyles<'.wrapper' | '.label' | '.error' | '.field' | '.content' | '.placeholder' | '.badge'>;

type SelectProps<T> = {
    styles?: SelectStyles;
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
} & Omit<FieldProps, 'value' | 'defaultValue' | 'onChange' | 'styles'>;

function SelectComponent<T extends FluidInputvalue>(
    {
        styles = {},
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
        ...props
    }: SelectProps<T>, ref: React.ForwardedRef<HTMLDivElement>) {
    const style = useStyles(styles, {
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

        '.wrapper[data-size="xsm"]': {
            fontSize: 'var(--f-font-size-xxs)'
        },

        '.wrapper[data-size="sml"]': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.wrapper[data-size="med"]': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.wrapper[data-size="lrg"]': {
            fontSize: 'var(--f-font-size-med)'
        },

        '.field[data-round="true"]': {
            borderRadius: '999px'
        }
    });

    const BadgeStyles = { // merge with select styles
        '.badge': {
            backgroundColor: 'var(--f-clr-fg-200)'
        },

        [`:global(.${style.field}[data-error="true"]) .badge`]: {
            backgroundColor: 'var(--f-clr-error-400)'
        },

        [`:global(.${style.field}[data-disabled="true"]) .badge`]: {
            backgroundColor: 'var(--f-clr-grey-200)'
        }
    };

    const id = useId();
    const popover = useRef<PopoverRootReference>(null);
    const [state, setState] = value !== undefined ? [value] : useState<FluidInputvalue | FluidInputvalue[]>(defaultValue || (multiple ? [] : ''));
    const [split, rest] = useInputProps(props);

    return <Combobox.Root ref={popover} stretch>
        <div ref={ref} {...rest} className={classes(style.wrapper, props.className)} data-size={size} aria-haspopup="listbox">
            {label && <div id={id} className={style.label}>{label}{props.required ? ' *' : ''}</div>}

            <Combobox.Trigger disabled={props.disabled || readOnly}>
                <div className={style.field} data-error={!!error} data-disabled={props.disabled} data-round={round}>
                    <div className={style.content_wrapper}>
                        {icon}

                        <div className={style.content}>
                            {!(Array.isArray(state) ? state.length : state) && <div className={style.placeholder}>{placeholder}</div>}

                            {Array.isArray(state) ?
                                (state.length < 3 ?
                                    state.map((val, i) => <Badge key={i} round={round} styles={BadgeStyles}>{val}</Badge>) :
                                    <>
                                        <Badge round={round} styles={BadgeStyles}>{state[0]}</Badge>
                                        <Badge round={round} styles={BadgeStyles}>+{state.length - 1} more</Badge>
                                    </>
                                ) :
                                options.find(option => option.value === state)?.label // TESTING!!
                            }
                        </div>

                        <input {...split} value={state?.toString()} readOnly aria-labelledby={label ? id : undefined} aria-invalid={!!error} className={style.input} />
                    </div>

                    <Button round={round} size={size} disabled={props.disabled || readOnly} variant="minimal" style={{ marginRight: '.3em' }}>
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