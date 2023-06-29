'use client';

import { forwardRef, useRef, useState, useId } from 'react';
import Field, { FieldProps } from './field';
import Button from './button';
import { MdCheck, MdExpandMore, MdUnfoldMore } from 'react-icons/md';
import useStyles from '@/src/hooks/use-styles';
import Halo from '../feedback/halo';
import { FluidError, FluidInputvalue, PopoverRootReference } from '@/src/types';
import { Animatable } from '@infinityfx/lively';
import { Move, Pop } from '@infinityfx/lively/animations';
import { classes } from '@/src/core/utils';
import Popover from '../layout/popover';
import Scrollarea from '../layout/scrollarea';
import Badge from '../display/badge';
import Combobox from '../display/combobox';
import useInputProps from '@/src/hooks/use-input-props';

// const Select = forwardRef(({ styles = {}, options, multiple = false, searchable, limit, emptyMessage = 'Nothing found', value, defaultValue, onChange, readOnly, ...props }:
//     {
//         options: {
//             label: string;
//             value: FluidInputvalue;
//             disabled?: boolean;
//         }[];
//         searchable?: boolean;
//         limit?: number;
//         emptyMessage?: string;
//         value?: FluidInputvalue | FluidInputvalue[];
//         defaultValue?: FluidInputvalue | FluidInputvalue[];
//         onChange?: (value: FluidInputvalue | FluidInputvalue[]) => void;
//     } & Omit<FieldProps, 'value' | 'defaultValue' | 'onChange'>, ref: React.ForwardedRef<HTMLDivElement>) => {
//     const style = useStyles(styles, {
//         '.container': {
//             maxHeight: '10.3em',
//             background: 'var(--f-clr-bg-100)',
//             border: 'solid 1px var(--f-clr-fg-200)',
//             borderRadius: 'calc(.3em + var(--f-radius-sml))',
//             boxShadow: '0 0 8px rgb(0, 0, 0, 0.06)',
//             width: '100%'
//         },

//         '.container[data-size="sml"]': {
//             fontSize: 'var(--f-font-size-xsm)'
//         },

//         '.container[data-size="med"]': {
//             fontSize: 'var(--f-font-size-sml)'
//         },

//         '.container[data-size="lrg"]': {
//             fontSize: 'var(--f-font-size-med)'
//         },

//         '.options': {
//             padding: '.3em'
//         },

//         '.option': {
//             position: 'relative',
//             padding: '.5em',
//             borderRadius: 'var(--f-radius-sml)',
//             border: 'none',
//             outline: 'none',
//             background: 'none',
//             width: '100%',
//             color: 'var(--f-clr-text-100)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between'
//         },

//         '.option:enabled': {
//             cursor: 'pointer'
//         },

//         '.option:disabled': {
//             color: 'var(--f-clr-grey-500)'
//         },

//         '.message': {
//             justifyContent: 'center',
//             color: 'var(--f-clr-grey-500)'
//         },

//         '.field[aria-autocomplete="none"][aria-disabled="false"]': {
//             cursor: 'pointer !important'
//         },

//         '.field[aria-autocomplete="none"][aria-disabled="false"] label': {
//             cursor: 'pointer !important'
//         },

//         '.field[aria-autocomplete="none"][aria-disabled="false"] input': {
//             cursor: 'pointer !important'
//         }
//     });

//     const popover = useRef<PopoverRootReference>(null);
//     const [state, setState] = value !== undefined ? [value] : useState<FluidInputvalue | FluidInputvalue[]>(defaultValue || (multiple ? [] : ''));
//     const [search, setSearch] = useState<string | null>(null);

//     const filtered = search ? options.filter(({ value }) => value?.toString().includes(search)) : options;
//     // let fieldValue;

//     // if (Array.isArray(state) && state.length > 0) {
//     //     if (state.length < 3) {
//     //         fieldValue = <>
//     //             {state.map(val => <Badge styles={BadgeStyles}>{val}</Badge>)}
//     //         </>;
//     //     } else {
//     //         fieldValue = <Badge styles={BadgeStyles}>{state.length} selected</Badge>;
//     //     }
//     // }

//     return <Popover.Root ref={popover} stretch onClose={() => setSearch(null)}>
//         <Popover.Trigger disabled={props.disabled || readOnly}>
//             <Field ref={ref} {...props} className={style.field}
//                 role="combobox"
//                 aria-haspopup="listbox"
//                 aria-autocomplete={searchable ? 'list' : 'none'}
//                 aria-disabled={readOnly || props.disabled || false}
//                 readOnly={!searchable || readOnly}
//                 value={search !== null ? search : state?.toString()}
//                 // displayValue={fieldValue}
//                 onChange={e => {
//                     setSearch(e.target.value);
//                 }}
//                 right={<Button round={props.round} size={props.size} disabled={props.disabled || readOnly} variant="light" style={{ marginRight: '.3em' }}>
//                     <MdExpandMore />
//                 </Button>} />
//         </Popover.Trigger>

//         <Popover.Content role="listbox" aria-multiselectable={multiple}>
//             <Animatable key="select-options-outer" animate={Move.unique({ duration: .2 })} unmount triggers={[{ on: 'mount' }]}>
//                 <Scrollarea className={style.container} data-size={props.size}>
//                     <div className={style.options}>
//                         <Animatable key="select-options-inner" animate={Pop.unique({ duration: .2 })} staggerLimit={4} stagger={.06}>
//                             {filtered.map(({ label, value, disabled }, i) => {
//                                 const selected = (Array.isArray(state) ? state.includes(value) : state === value);

//                                 return <Halo key={i} disabled={disabled}>
//                                     <button type="button" role="option" aria-selected={selected} disabled={disabled} className={style.option} onClick={() => {
//                                         if (!Array.isArray(state)) {
//                                             popover.current?.close();
//                                             setState?.(value);
//                                             onChange?.(value);
//                                         } else {
//                                             const updated = state.slice();
//                                             const idx = updated.indexOf(value);
//                                             if (idx < 0) {
//                                                 if (!limit || updated.length < limit) updated.push(value);
//                                             } else updated.splice(idx, 1);

//                                             setState?.(updated);
//                                             onChange?.(updated);
//                                         }
//                                     }}>
//                                         {label}

//                                         {selected && <MdCheck />}
//                                     </button>
//                                 </Halo>;
//                             })}
//                         </Animatable>

//                         {!filtered.length && <div className={classes(style.option, style.message)}>
//                             {emptyMessage}
//                         </div>}
//                     </div>
//                 </Scrollarea>
//             </Animatable>
//         </Popover.Content>
//     </Popover.Root>;
// });

const Select = forwardRef((
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
        icon,
        size,
        round,
        ...props
    }:
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
        '.wrapper': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xxs)',
            width: 'clamp(0px, 12em, 100vw)'
        },

        '.label': {
            fontSize: '.8em',
            fontWeight: 500,
            color: 'var(--f-clr-text-100)'
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
            borderColor: 'var(--f-clr-error-100)'
        },

        '.field[data-error="true"] .content': {
            color: 'var(--f-clr-error-200)'
        },

        '.field[data-disabled="true"]': {
            backgroundColor: 'var(--f-clr-grey-100)',
            borderColor: 'var(--f-clr-grey-200)'
        },

        '.content_wrapper': {
            height: '2.6em',
            padding: '.6em',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xsm)',
            overflow: 'hidden',
            flexGrow: 1
        },

        '.content': {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xsm)',
            flexGrow: 1,
            overflow: 'hidden',
            color: 'var(--f-clr-text-100)'
        },

        '.content > *': {
            flexShrink: 0
        },

        '.placeholder': {
            color: 'var(--f-clr-grey-300)'
        },

        '.input': {
            position: 'absolute',
            opacity: 0
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

    const BadgeStyles = {
        '.badge': {
            backgroundColor: error ? 'var(--f-clr-error-400)' : 'var(--f-clr-fg-200)'
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
                                    <Badge round={round} styles={BadgeStyles}>{state.length} selected</Badge>
                                ) :
                                state
                            }
                        </div>

                        <input {...split} aria-labelledby={label ? id : undefined} aria-invalid={!!error} className={style.input} />
                    </div>

                    <Button round={round} size={size} disabled={props.disabled || readOnly} variant="minimal" style={{ marginRight: '.3em' }}>
                        <MdUnfoldMore />
                    </Button>
                </div>
            </Combobox.Trigger>
        </div>

        <Combobox.Content aria-multiselectable={multiple} searchable={searchable} emptyMessage={emptyMessage}>
            {options.map(({ label, value, disabled }, i) => {
                const selected = (Array.isArray(state) ? state.includes(value) : state === value);

                return <Combobox.Option key={i} value={value} disabled={disabled} onSelect={() => {
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

                    {selected && <MdCheck style={{ marginLeft: 'auto' }} />}
                </Combobox.Option>;
            })}
        </Combobox.Content>
    </Combobox.Root>;
});

Select.displayName = 'Select';

export default Select;