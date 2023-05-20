import { forwardRef, useState } from 'react';
import Field, { FieldProps } from './field';
import Button from './button';
import { MdArrowDownward, MdCheck } from 'react-icons/md';
import Popover from '../layout/popover';
import useStyles from '@/src/hooks/use-styles';
import { Halo } from '../feedback';
import { FluidInputvalue } from '@/src/types';
import { Animatable } from '@infinityfx/lively';
import { Move, Pop } from '@infinityfx/lively/animations';
import { classes } from '@/src/core/utils';
import { Scrollarea } from '../layout';

const Select = forwardRef(({ styles = {}, options, multiple = false, searchable, limit, emptyMessage = 'Nothing found', value, onChange, readOnly, ...props }:
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
        onChange?: (value: FluidInputvalue | FluidInputvalue[]) => void;
    } & Omit<FieldProps, 'value' | 'onChange'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.container': {
            maxHeight: '10.3em',
            background: 'var(--f-clr-bg-100)',
            border: 'solid 1px var(--f-clr-grey-100)',
            borderRadius: 'var(--f-radius-sml)',
            boxShadow: '0 0 8px rgb(0, 0, 0, 0.06)',
            fontSize: 'var(--f-font-size-sml)',
            width: 'clamp(0px, 12em, 100vw)'
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

    const [state, setState] = value !== undefined ? [value] : useState<FluidInputvalue | FluidInputvalue[]>(multiple ? [] : '');
    const [search, setSearch] = useState<string | null>(null);

    const filtered = search ? options.filter(({ value }) => value?.toString().includes(search)) : options;

    return <Popover role="listbox" aria-multiselectable={multiple} disabled={props.disabled || readOnly} content={close => <Animatable key="select-options-outer" animate={Move.unique({ duration: .2 })} unmount triggers={[{ on: 'mount' }]}>
        <Scrollarea className={style.container}>
            <div className={style.options}>
                <Animatable key="select-options-inner" animate={Pop.unique({ duration: .2 })} staggerLimit={4} stagger={.06}>
                    {filtered.map(({ label, value, disabled }, i) => {
                        const selected = (Array.isArray(state) ? state.includes(value) : state === value);

                        return <div key={i}>
                            <Halo disabled={disabled}>
                                <button type="button" role="option" aria-selected={selected} disabled={disabled} className={style.option} onClick={() => {
                                    if (!Array.isArray(state)) {
                                        close();
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
    </Animatable>}>
        <Field ref={ref} {...props} className={style.field}
            role="combobox"
            aria-haspopup="listbox"
            aria-autocomplete={searchable ? 'list' : 'none'}
            aria-disabled={readOnly || props.disabled || false}
            readOnly={!searchable || readOnly}
            value={search !== null ? search : state?.toString()}
            onChange={e => {
                setSearch(e.target.value);
            }}
            onBlur={() => setSearch(null)}
            right={<Button round={props.round} disabled={props.disabled || readOnly} variant="light" style={{ marginRight: '.3em' }}>
                <MdArrowDownward />
            </Button>} />
    </Popover>
});

Select.displayName = 'Select';

export default Select;