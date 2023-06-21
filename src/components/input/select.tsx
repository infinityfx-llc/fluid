'use client';

import { forwardRef, useRef, useState } from 'react';
import Field, { FieldProps } from './field';
import Button from './button';
import { MdCheck, MdExpandMore } from 'react-icons/md';
import useStyles from '@/src/hooks/use-styles';
import Halo from '../feedback/halo';
import { FluidInputvalue, PopoverRootReference } from '@/src/types';
import { Animatable } from '@infinityfx/lively';
import { Move, Pop } from '@infinityfx/lively/animations';
import { classes } from '@/src/core/utils';
import Popover from '../layout/popover';
import Scrollarea from '../layout/scrollarea';
import Badge from '../display/badge';

const BadgeStyles = {
    '.badge': {
        backgroundColor: 'var(--f-clr-grey-100)'
    }
};

const Select = forwardRef(({ styles = {}, options, multiple = false, searchable, limit, emptyMessage = 'Nothing found', value, defaultValue, onChange, readOnly, ...props }:
    {
        options: {
            label: string;
            value: FluidInputvalue;
            disabled?: boolean;
        }[];
        searchable?: boolean;
        limit?: number;
        emptyMessage?: string;
        value?: FluidInputvalue | FluidInputvalue[];
        defaultValue?: FluidInputvalue | FluidInputvalue[];
        onChange?: (value: FluidInputvalue | FluidInputvalue[]) => void;
    } & Omit<FieldProps, 'value' | 'defaultValue' | 'onChange'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.container': {
            maxHeight: '10.3em',
            background: 'var(--f-clr-bg-100)',
            border: 'solid 1px var(--f-clr-grey-100)',
            borderRadius: 'calc(.15em + var(--f-radius-sml))',
            boxShadow: '0 0 8px rgb(0, 0, 0, 0.06)',
            width: '100%'
        },

        '.container[data-size="sml"]': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.container[data-size="med"]': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.container[data-size="lrg"]': {
            fontSize: 'var(--f-font-size-med)'
        },

        '.options': {
            padding: '.3em'
        },

        '.option': {
            position: 'relative',
            padding: '.5em',
            borderRadius: 'var(--f-radius-sml)',
            border: 'none',
            outline: 'none',
            background: 'none',
            width: '100%',
            color: 'var(--f-clr-text-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },

        '.option:enabled': {
            cursor: 'pointer'
        },

        '.option:disabled': {
            color: 'var(--f-clr-grey-500)'
        },

        '.message': {
            justifyContent: 'center',
            color: 'var(--f-clr-grey-500)'
        },

        '.field[aria-autocomplete="none"][aria-disabled="false"]': {
            cursor: 'pointer !important'
        },

        '.field[aria-autocomplete="none"][aria-disabled="false"] label': {
            cursor: 'pointer !important'
        },

        '.field[aria-autocomplete="none"][aria-disabled="false"] input': {
            cursor: 'pointer !important'
        }
    });

    const popover = useRef<PopoverRootReference>(null);
    const [state, setState] = value !== undefined ? [value] : useState<FluidInputvalue | FluidInputvalue[]>(defaultValue || (multiple ? [] : ''));
    const [search, setSearch] = useState<string | null>(null);

    const filtered = search ? options.filter(({ value }) => value?.toString().includes(search)) : options;
    // let fieldValue;

    // if (Array.isArray(state) && state.length > 0) {
    //     if (state.length < 3) {
    //         fieldValue = <>
    //             {state.map(val => <Badge styles={BadgeStyles}>{val}</Badge>)}
    //         </>;
    //     } else {
    //         fieldValue = <Badge styles={BadgeStyles}>{state.length} selected</Badge>;
    //     }
    // }

    return <Popover.Root ref={popover} stretch onClose={() => setSearch(null)}>
        <Popover.Trigger disabled={props.disabled || readOnly}>
            <Field ref={ref} {...props} className={style.field}
                role="combobox"
                aria-haspopup="listbox"
                aria-autocomplete={searchable ? 'list' : 'none'}
                aria-disabled={readOnly || props.disabled || false}
                readOnly={!searchable || readOnly}
                value={search !== null ? search : state?.toString()}
                // displayValue={fieldValue}
                onChange={e => {
                    setSearch(e.target.value);
                }}
                right={<Button round={props.round} size={props.size} disabled={props.disabled || readOnly} variant="light" style={{ marginRight: '.3em' }}>
                    <MdExpandMore />
                </Button>} />
        </Popover.Trigger>

        <Popover.Content role="listbox" aria-multiselectable={multiple}>
            <Animatable key="select-options-outer" animate={Move.unique({ duration: .2 })} unmount triggers={[{ on: 'mount' }]}>
                <Scrollarea className={style.container} data-size={props.size}>
                    <div className={style.options}>
                        <Animatable key="select-options-inner" animate={Pop.unique({ duration: .2 })} staggerLimit={4} stagger={.06}>
                            {filtered.map(({ label, value, disabled }, i) => {
                                const selected = (Array.isArray(state) ? state.includes(value) : state === value);

                                return <div key={i}>
                                    <Halo disabled={disabled}>
                                        <button type="button" role="option" aria-selected={selected} disabled={disabled} className={style.option} onClick={() => {
                                            if (!Array.isArray(state)) {
                                                popover.current?.close();
                                                setState?.(value);
                                                onChange?.(value);
                                            } else {
                                                const updated = state.slice();
                                                const idx = updated.indexOf(value);
                                                if (idx < 0) {
                                                    if (!limit || updated.length < limit) updated.push(value);
                                                } else updated.splice(idx, 1);

                                                setState?.(updated);
                                                onChange?.(updated);
                                            }
                                        }}>
                                            {label}

                                            {selected && <MdCheck />}
                                        </button>
                                    </Halo>
                                </div>;
                            })}
                        </Animatable>

                        {!filtered.length && <div className={classes(style.option, style.message)}>
                            {emptyMessage}
                        </div>}
                    </div>
                </Scrollarea>
            </Animatable>
        </Popover.Content>
    </Popover.Root>;
});

Select.displayName = 'Select';

export default Select;