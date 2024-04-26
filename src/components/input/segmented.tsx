'use client';

import { FluidError, FluidInputvalue, FluidSize, FluidStyles, Selectors } from "../../../src/types";
import { forwardRef, useId, useState } from "react";
import { Morph } from '@infinityfx/lively/layout';
import { classes, combineClasses } from "../../../src/core/utils";
import Halo from "../feedback/halo";
import { createStyles } from "../../core/style";

type SegmentedProps<T> = {
    cc?: Selectors<'segmented' | 'segmented__sml' | 'segmented__med' | 'segmented__lrg' | 'segmented__round' | 'option' | 'content' | 'selection' | 'segmented__var__default' | 'segmented__var__neutral' | 'halo' | 'container'>;
    variant?: 'default' | 'neutral';
    size?: Omit<FluidSize, 'xsm'>;
    round?: boolean;
    uniform?: boolean;
    options: { label: React.ReactNode; value: FluidInputvalue; disabled?: boolean; }[];
    name?: string;
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
    error?: FluidError;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'>;

function SegmentedComponent<T extends FluidInputvalue>({ cc = {}, variant = 'default', size = 'med', round = false, uniform, options, name, value, defaultValue, onChange, error, ...props }: SegmentedProps<T>, ref: React.ForwardedRef<HTMLDivElement>) {
    const styles = createStyles('segmented', {
        '.segmented': {
            padding: '.3em',
            borderRadius: 'calc(var(--f-radius-sml) + .3em)',
            backgroundColor: 'var(--f-clr-fg-100)',
            border: 'solid 1px var(--f-clr-fg-200)',
            display: 'flex'
        },

        '.segmented__sml': {
            fontSize: 'var(--f-font-size-xxs)'
        },

        '.segmented__med': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.segmented__lrg': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.segmented__round': {
            borderRadius: '999px'
        },

        '.segmented__uniform': {
            display: 'grid',
            gridAutoColumns: '1fr',
            gridAutoFlow: 'column'
        },

        '.option': {
            position: 'relative',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            padding: '.675em .8em',
            fontWeight: 700,
            color: 'var(--f-clr-text-100)',
            borderRadius: 'var(--f-radius-sml)',
            flexGrow: 1
        },

        '.segmented__round .option': {
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
            boxShadow: 'var(--f-shadow-sml)'
        },

        '.segmented__var__neutral .selection': {
            backgroundColor: 'var(--f-clr-fg-200)'
        },

        '.segmented__round .selection': {
            borderRadius: '999px'
        },

        '.segmented[data-error="true"]': {
            border: 'solid 1px var(--f-clr-error-100)'
        },

        '.option[aria-checked="true"] .halo': {
            inset: '-.3em',
            borderRadius: 'calc(var(--f-radius-sml) + .3em)'
        },

        '.halo': {
            zIndex: '0 !important'
        },

        '.segmented[data-error="true"] .ring': {
            backgroundColor: 'var(--f-clr-error-300)'
        },

        '.container': {
            zIndex: 'unset !important'
        }
    });
    const style = combineClasses(styles, cc);

    const [state, setState] = value !== undefined ? [value] : useState(defaultValue || options[0]?.value);
    const id = useId();

    return <div ref={ref} {...props}
        role="radiogroup"
        className={classes(
            style.segmented,
            style[`segmented__${size}`],
            style[`segmented__var__${variant}`],
            round && style.segmented__round,
            uniform && style.segmented__uniform,
            props.className
        )}
        data-error={!!error}>
        {options.map(({ label, value: option, disabled = false }, i) => {

            return <Halo key={i} hover={false} cc={{
                halo: style.halo,
                container: style.container,
                ring: style.ring
            }}>
                <button className={style.option} type="button" role="radio" aria-checked={state === option} disabled={disabled}
                    onClick={() => {
                        setState?.(option);
                        onChange?.(option as T);
                    }}>
                    <input type="radio" value={option} checked={state === option} hidden readOnly name={name} />
                    <span className={style.content}>{label}</span>

                    <Morph group={`segmented-selection-${id}`} show={state === option} cachable={['x', 'sx']} deform={false} transition={{ duration: .4 }}>
                        <div className={style.selection} />
                    </Morph>
                </button>
            </Halo>;
        })}
    </div>
}

const Segmented = forwardRef(SegmentedComponent) as (<T extends FluidInputvalue>(props: SegmentedProps<T> & { ref?: React.ForwardedRef<HTMLDivElement>; }) => ReturnType<typeof SegmentedComponent>) & { displayName: string; };

Segmented.displayName = 'Segmented';

export default Segmented;