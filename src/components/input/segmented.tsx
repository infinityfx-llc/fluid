'use client';

import useStyles from "@/src/hooks/use-styles";
import { FluidError, FluidInputvalue, FluidStyles } from "@/src/types";
import { forwardRef, useId, useState } from "react";
import { Morph } from '@infinityfx/lively/layout';
import { classes } from "@/src/core/utils";
import Halo from "../feedback/halo";

const Segmented = forwardRef(({ styles = {}, variant = 'default', round = false, options, name, value, defaultValue, onChange, error, ...props }:
    {
        styles?: FluidStyles;
        variant?: 'default' | 'neutral';
        round?: boolean;
        options: { label: React.ReactNode; value: FluidInputvalue; disabled?: boolean; }[];
        name?: string;
        value?: FluidInputvalue;
        defaultValue?: FluidInputvalue;
        onChange?: (value: FluidInputvalue) => void;
        error?: FluidError;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.segmented': {
            padding: '.3em',
            borderRadius: 'calc(var(--f-radius-sml) + .3em)',
            backgroundColor: 'var(--f-clr-fg-100)',
            display: 'flex'
        },

        '.segmented[data-round="true"]': {
            borderRadius: '999px'
        },

        '.option': {
            position: 'relative',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            padding: '.65em .8em',
            fontWeight: 700,
            fontSize: 'var(--f-font-size-xsm)',
            color: 'var(--f-clr-text-100)',
            borderRadius: 'var(--f-radius-sml)',
            flexGrow: 1
        },

        '.segmented[data-round="true"] .option': {
            borderRadius: '999px'
        },

        '.option:enabled': {
            cursor: 'pointer'
        },

        '.option:disabled': {
            color: 'var(--f-clr-grey-500)'
        },

        '.content': {
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--f-spacing-xsm)'
        },

        '.selection': {
            position: 'absolute',
            inset: '0',
            backgroundColor: 'var(--f-clr-primary-200)',
            borderRadius: 'var(--f-radius-sml)',
            boxShadow: '0 0 8px rgb(0, 0, 0, .06)'
        },

        '.segmented[data-variant="neutral"] .selection': {
            backgroundColor: 'var(--f-clr-bg-100)',
            border: 'solid 1px var(--f-clr-fg-200)'
        },

        '.segmented[data-round="true"] .selection': {
            borderRadius: '999px'
        },

        '.segmented[data-error="true"]': {
            outline: 'solid 2px var(--f-clr-error-300)'
        },

        '.option[aria-checked="true"] .halo': {
            inset: '-.5em'
        }
    });

    const [state, setState] = value !== undefined ? [value] : useState(defaultValue || options[0]?.value);
    const id = useId();

    return <div ref={ref} {...props} role="radiogroup" className={classes(style.segmented, props.className)} data-variant={variant} data-round={round} data-error={!!error}>
        {options.map(({ label, value: option, disabled = false }, i) => {

            return <Halo key={i} hover={false} styles={{
                [`:global(.${style.option})[aria-checked="true"] .halo`]: { inset: '-.5em' },
                '.halo': {
                    zIndex: 0
                },
                '.container': {
                    zIndex: 'unset'
                }
            }}>
                <button className={style.option} type="button" role="radio" aria-checked={state === option} disabled={disabled} onClick={() => {
                    setState?.(option);
                    onChange?.(option);
                }}>
                    <input type="radio" value={option} checked={state === option} hidden readOnly name={name} />
                    <span className={style.content}>{label}</span>

                    <Morph id={`segmented-selection-${id}`} shown={state === option} include={['translate', 'scale']} deform={false} transition={{ duration: .4 }}>
                        <div className={style.selection} />
                    </Morph>
                </button>
            </Halo>;
        })}
    </div>
});

Segmented.displayName = 'Segmented';

export default Segmented;