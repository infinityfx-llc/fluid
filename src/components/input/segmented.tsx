'use client';

import { FluidInputvalue, FluidSize, Selectors } from "../../../src/types";
import { useId, useState } from "react";
import { Morph } from '@infinityfx/lively/layout';
import { classes, combineClasses } from "../../../src/core/utils";
import Halo from "../feedback/halo";
import { createStyles } from "../../core/style";

const styles = createStyles('segmented', {
    '.segmented': {
        position: 'relative',
        display: 'flex'
    },

    '.v__default, .v__neutral': {
        borderRadius: 'calc(var(--f-radius-sml) + .3em)',
        backgroundColor: 'var(--f-clr-fg-100)',
        border: 'solid 1px var(--f-clr-fg-200)',
        padding: '.3em'
    },

    '.s__sml': {
        fontSize: 'var(--f-font-size-xxs)'
    },

    '.s__med': {
        fontSize: 'var(--f-font-size-xsm)'
    },

    '.s__lrg': {
        fontSize: 'var(--f-font-size-sml)'
    },

    '.segmented.uniform': {
        display: 'grid',
        gridAutoColumns: '1fr',
        gridAutoFlow: 'column'
    },

    '.segmented.vertical': {
        flexDirection: 'column',
        gridAutoFlow: 'row'
    },

    '.segmented.round': {
        borderRadius: 'calc(1.6em + 1px)'
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
        flexGrow: 1,
        transition: 'color .4s',
        WebkitTapHighlightColor: 'transparent'
    },

    '.segmented.round .option': {
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

    '.v__neutral .selection': {
        backgroundColor: 'var(--f-clr-text-100)'
    },

    '.v__neutral .option[aria-checked="true"]:enabled': {
        color: 'var(--f-clr-text-200)'
    },

    '.v__minimal .selection': {
        backgroundColor: 'var(--f-clr-primary-400)'
    },

    '.segmented.round .selection': {
        borderRadius: '999px'
    },

    '.segmented[data-error="true"]': {
        border: 'solid 1px var(--f-clr-error-100)'
    },

    '.segmented .halo': {
        zIndex: '0'
    },

    '.option[aria-checked="true"] .halo': {
        inset: '-.3em',
        borderRadius: 'calc(var(--f-radius-sml) + .3em)'
    },

    '.segmented[data-error="true"] .ripple': {
        backgroundColor: 'var(--f-clr-error-300)'
    },

    '.segmented .container': {
        isolation: 'unset'
    }
});

export type SegmentedSelectors = Selectors<'segmented' | 's__sml' | 's__med' | 's__lrg' | 'round' | 'uniform' | 'vertical' | 'v__default' | 'v__neutral' | 'v__minimal' | 'option' | 'content' | 'selection'>;

type SegmentedProps<T> = {
    ref?: React.Ref<HTMLDivElement>;
    cc?: SegmentedSelectors;
    variant?: 'default' | 'neutral' | 'minimal';
    size?: Omit<FluidSize, 'xsm'>;
    round?: boolean;
    /**
     * Whether all entries should be equal size, regardless of their content.
     * 
     * @default false
     */
    uniform?: boolean;
    /**
     * @default false
     */
    vertical?: boolean;
    options: {
        label: React.ReactNode;
        value: FluidInputvalue;
        disabled?: boolean;
    }[];
    name?: string;
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
    error?: any;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'>;

/**
 * An input with multiple options of which only 1 can be selected at a time.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/segmented}
 */
export default function Segmented<T extends FluidInputvalue>({ cc = {}, variant = 'default', size = 'med', round = false, uniform, vertical, options, name, value, defaultValue, onChange, error, ...props }: SegmentedProps<T>) {
    const style = combineClasses(styles, cc);

    const [state, setState] = value !== undefined ? [value] : useState(defaultValue || options[0]?.value);
    const id = useId();

    return <div {...props}
        role="radiogroup"
        className={classes(
            style.segmented,
            style[`s__${size}`],
            style[`v__${variant}`],
            round && style.round,
            uniform && style.uniform,
            vertical && style.vertical,
            props.className
        )}
        data-error={!!error}
        data-fb={variant !== 'minimal' ? 'true' : undefined}>
        {options.map(({ label, value: option, disabled = false }, i) => {

            return <Halo key={i} hover={false} cc={{
                ...cc,
                container: style.container,
                halo: style.halo,
                ring: style.ring
            }}>
                <button
                    className={style.option}
                    type="button"
                    role="radio"
                    aria-checked={state === option}
                    disabled={disabled}
                    onClick={() => {
                        setState?.(option);
                        onChange?.(option as T);
                    }}>
                    <input type="radio" value={option} checked={state === option} hidden readOnly name={name} />
                    <span className={style.content}>{label}</span>

                    {state === option && <Morph group={`segmented-selection-${id}`} cachable={vertical ? ['y', 'sy'] : ['x', 'sx']} deform={false} transition={{ duration: .4 }}>
                        <div className={style.selection} />
                    </Morph>}
                </button>
            </Halo>;
        })}
    </div>
}