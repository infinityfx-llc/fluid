'use client';

import { classes, combineClasses } from '../../../src/core/utils';
import useInputProps from '../../../src/hooks/use-input-props';
import { FluidSize, Selectors } from '../../../src/types';
import { Animatable } from '@infinityfx/lively';
import { useLink } from '@infinityfx/lively/hooks';
import { forwardRef, useEffect, useState } from 'react';
import Halo from '../feedback/halo';
import { createStyles } from '../../core/style';

const styles = createStyles('chip', {
    '.input': {
        position: 'absolute',
        opacity: 0
    },

    '.wrapper': {
        position: 'relative',
        borderRadius: 'var(--f-radius-sml)'
    },

    '.s__sml': {
        fontSize: 'var(--f-font-size-xxs)',
    },

    '.s__med': {
        fontSize: 'var(--f-font-size-xsm)',
    },

    '.s__lrg': {
        fontSize: 'var(--f-font-size-sml)',
    },

    '.chip': {
        backgroundColor: 'var(--f-clr-fg-200)',
        color: 'var(--f-clr-text-100)',
        fontWeight: 600,
        padding: '.5em',
        paddingRight: '.7em',
        borderRadius: 'var(--f-radius-sml)',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xsm)',
        transition: 'background-color .15s, color .15s'
    },

    '.v__neutral .chip': {
        border: 'solid 1px var(--f-clr-fg-200)',
        backgroundColor: 'var(--f-clr-bg-100)'
    },

    '.content': {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xsm)',
        transition: 'translate .15s'
    },

    '.input:not(:checked) + .chip .content': {
        translate: 'calc(var(--f-spacing-xsm) / -2 - .45em) 0'
    },

    '.checkmark': {
        width: '1em',
        stroke: 'var(--f-clr-text-200)',
        strokeWidth: 3,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    },

    '.v__neutral .checkmark': {
        stroke: 'var(--f-clr-text-100)',
    },

    '.wrapper.round': {
        borderRadius: '999px'
    },

    '.wrapper.round .chip': {
        borderRadius: '999px'
    },

    '.input:enabled + .chip': {
        cursor: 'pointer'
    },

    '.v__default .input:checked + .chip': {
        backgroundColor: 'var(--f-clr-primary-100)',
        color: 'var(--f-clr-text-200)'
    },

    '.v__neutral .input:checked + .chip': {
        backgroundColor: 'var(--f-clr-fg-200)'
    },

    '.input:disabled + .chip': {
        color: 'var(--f-clr-grey-500)'
    },

    '.input:disabled + .chip .checkmark': {
        stroke: 'var(--f-clr-grey-100)'
    },

    '.v__default .input:checked:disabled + .chip': {
        color: 'var(--f-clr-grey-100)',
        backgroundColor: 'var(--f-clr-grey-300)'
    },

    '.v__neutral .input:checked:disabled + .chip': {
        color: 'var(--f-clr-grey-500)',
    },

    '.v__neutral .input:disabled + .chip .checkmark': {
        stroke: 'var(--f-clr-grey-500)'
    },

    '.wrapper .halo': {
        inset: '-.5em'
    }
});

export type ChipSelectors = Selectors<'input' | 'wrapper' | 's__sml' | 's__med' | 's__lrg' | 'v__default' | 'v__neutral' | 'chip' | 'content' | 'checkmark'>;

// content not centered on flex grow
const Chip = forwardRef(({ children, cc = {}, round = false, size = 'med', variant = 'default', checked, defaultChecked, ...props }:
    {
        cc?: ChipSelectors;
        round?: boolean;
        size?: Exclude<FluidSize, 'xsm'>;
        variant?: 'default' | 'neutral'; // light variant
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>, ref: React.ForwardedRef<HTMLLabelElement>) => {
    const style = combineClasses(styles, cc);

    const [split, rest] = useInputProps(props);
    const link = useLink(defaultChecked ? 1 : 0);
    const [state, setState] = checked !== undefined ? [checked] : useState(defaultChecked || false);

    useEffect(() => link.set(state ? 1 : 0, .25), [state]);

    return <Halo hover={false} cc={{ halo: style.halo, ...cc }}>
        <label ref={ref} {...rest}
            className={classes(
                style.wrapper,
                style[`s__${size}`],
                style[`v__${variant}`],
                round && style.round,
                rest.className
            )}>
            <input {...split} checked={state} type="checkbox" className={style.input} onChange={e => {
                setState?.(e.target.checked);
                props.onChange?.(e);
            }} />

            <div className={style.chip}>
                <svg viewBox="0 0 18 18" className={style.checkmark}>
                    <Animatable animate={{ strokeLength: link }} initial={{ strokeDashoffset: state ? 0 : 1 }}>
                        <path d="M 3 9 L 8 13 L 15 5" fill="none" />
                    </Animatable>
                </svg>

                <div className={style.content}>
                    {children}
                </div>
            </div>
        </label>
    </Halo>;
});

Chip.displayName = 'Chip';

export default Chip;