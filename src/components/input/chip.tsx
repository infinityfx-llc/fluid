'use client';

import { classes, combineClasses } from '../../../src/core/utils';
import useInputProps from '../../../src/hooks/use-input-props';
import { FluidSize, Selectors } from '../../../src/types';
import { useEffect, useState } from 'react';
import { createStyles } from '../../core/style';
import { Animatable } from '@infinityfx/lively';
import { useLink } from '@infinityfx/lively/hooks';

const styles = createStyles('chip', {
    '.wrapper': {
        position: 'relative',
        borderRadius: 'var(--f-radius-sml)'
    },

    '.wrapper.round': {
        borderRadius: '999px'
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

    '.input': {
        position: 'absolute',
        opacity: 0,
        inset: 0,
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        WebkitTapHighlightColor: 'transparent'
    },

    '.input[type="checkbox"]:enabled': {
        cursor: 'pointer'
    },

    '.input[type="radio"]:enabled:not(:checked)': {
        cursor: 'pointer'
    },

    '.chip': {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--f-clr-fg-100)',
        borderRadius: 'inherit',
        color: 'var(--f-clr-text-100)',
        fontWeight: 600,
        padding: '.5em',
        paddingRight: '.7em',
        gap: '.7em',
        userSelect: 'none',
        lineHeight: 1.2,
        transition: 'background-color .15s, color .15s'
    },

    '.checkmark': {
        backgroundColor: 'var(--f-clr-bg-100)',
        borderRadius: '3px',
        padding: '.2em',
        width: '1.2em',
        stroke: 'white',
        strokeWidth: 3,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        transition: 'background-color .15s'
    },

    '.wrapper.round .checkmark': {
        borderRadius: '999px'
    },

    '.input:enabled:checked + .chip': {
        backgroundColor: 'var(--f-clr-primary-600)',
        color: 'var(--f-clr-primary-100)'
    },

    '.input:enabled:checked + .chip .checkmark': {
        backgroundColor: 'var(--f-clr-primary-100)'
    },

    '.input:disabled + .chip': {
        color: 'var(--f-clr-grey-300)'
    },

    '.input:disabled + .chip .checkmark': {
        backgroundColor: 'var(--f-clr-grey-100)'
    },

    '.input:checked:disabled + .chip': {
        backgroundColor: 'var(--f-clr-grey-200)',
        color: 'var(--f-clr-grey-500)'
    },

    '.input:checked:disabled + .chip .checkmark': {
        backgroundColor: 'var(--f-clr-grey-300)',
        stroke: 'var(--f-clr-grey-500)'
    },

    '.input:enabled:focus-visible + .chip': {
        backgroundColor: 'var(--f-clr-primary-600)'
    },

    '.input:enabled:checked:focus-visible + .chip': {
        backgroundColor: 'var(--f-clr-primary-500)'
    }
});

export type ChipSelectors = Selectors<'wrapper' | 's__xsm' | 's__sml' | 's__med' | 's__lrg' | 'round' | 'chip' | 'checkmark'>;

/**
 * An input that switches between a selected and unselected state.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/chip}
 */
export default function Chip({ children, cc = {}, size = 'med', type = 'checkbox', round, checked, defaultChecked, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: ChipSelectors;
        size?: FluidSize;
        /**
         * @default "checkbox"
         */
        type?: 'checkbox' | 'radio';
        round?: boolean;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>) {
    const style = combineClasses(styles, cc);

    const [split, rest] = useInputProps(props);
    const link = useLink(defaultChecked ? 1 : 0);
    const [state, setState] = checked !== undefined ? [checked] : useState(defaultChecked || false);

    useEffect(() => link.set(state ? 1 : 0, { duration: .15 }), [state]);

    return <div {...rest}
        className={classes(
            style.wrapper,
            style[`s__${size}`],
            round && style.round,
            rest.className
        )}>
        <input {...split} type={type} className={style.input} checked={state} onChange={e => {
            setState?.(e.target.checked);
            props.onChange?.(e);
        }} />

        <div className={style.chip}>
            <svg viewBox="0 0 18 18" className={style.checkmark}>
                <Animatable animate={{ strokeLength: link }} initial={{ strokeDashoffset: state ? 0 : 1 }}>
                    <path d="M 3 9 L 8 13 L 15 5" fill="none" />
                </Animatable>
            </svg>

            {children}
        </div>
    </div>;
}