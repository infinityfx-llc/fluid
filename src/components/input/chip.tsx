'use client';

import { classes, combineClasses } from '../../../src/core/utils';
import useInputProps from '../../../src/hooks/use-input-props';
import { FluidSize, FluidStyles, Selectors } from '../../../src/types';
import { Animatable } from '@infinityfx/lively';
import { useLink } from '@infinityfx/lively/hooks';
import { forwardRef, useEffect, useState } from 'react';
import Halo from '../feedback/halo';
import { createStyles } from '../../core/style';

const Chip = forwardRef(({ children, cc = {}, round = false, size = 'med', variant = 'default', checked, defaultChecked, ...props }:
    {
        cc?: Selectors<'input' | 'wrapper' | 'chip' | 'content' | 'checkmark' | 'input'>;
        round?: boolean;
        size?: Exclude<FluidSize, 'xsm'>;
        variant?: 'default' | 'neutral'; // light variant
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>, ref: React.ForwardedRef<HTMLLabelElement>) => {
    const styles = createStyles('chip', {
        '.input': {
            position: 'absolute',
            opacity: 0
        },

        '.wrapper': {
            position: 'relative',
            borderRadius: 'var(--f-radius-sml)'
        },

        '.wrapper[data-size="sml"]': {
            fontSize: 'var(--f-font-size-xxs)',
        },

        '.wrapper[data-size="med"]': {
            fontSize: 'var(--f-font-size-xsm)',
        },

        '.wrapper[data-size="lrg"]': {
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

        '.wrapper[data-variant="neutral"] .chip': {
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

        '.wrapper[data-variant="neutral"] .checkmark': {
            stroke: 'var(--f-clr-text-100)',
        },

        '.wrapper[data-round="true"]': {
            borderRadius: '999px'
        },

        '.wrapper[data-round="true"] .chip': {
            borderRadius: '999px'
        },

        '.input:enabled + .chip': {
            cursor: 'pointer'
        },

        '.wrapper[data-variant="default"] .input:checked + .chip': {
            backgroundColor: 'var(--f-clr-primary-100)',
            color: 'var(--f-clr-text-200)'
        },

        '.wrapper[data-variant="neutral"] .input:checked + .chip': {
            backgroundColor: 'var(--f-clr-fg-200)'
        },

        '.input:disabled + .chip': {
            color: 'var(--f-clr-grey-500)'
        },

        '.input:disabled + .chip .checkmark': {
            stroke: 'var(--f-clr-grey-100)'
        },

        '.wrapper[data-variant="default"] .input:checked:disabled + .chip': {
            color: 'var(--f-clr-grey-100)',
            backgroundColor: 'var(--f-clr-grey-300)'
        },

        '.wrapper[data-variant="neutral"] .input:checked:disabled + .chip': {
            color: 'var(--f-clr-grey-500)',
        },

        '.wrapper[data-variant="neutral"] .input:disabled + .chip .checkmark': {
            stroke: 'var(--f-clr-grey-500)'
        },

        '.halo': {
            inset: '-.5em !important'
        }
    });
    const style = combineClasses(styles, cc);

    const [split, rest] = useInputProps(props);
    const link = useLink(defaultChecked ? 1 : 0);
    const [state, setState] = checked !== undefined ? [checked] : useState(defaultChecked || false);

    useEffect(() => link.set(state ? 1 : 0, .25), [state]);

    return <Halo hover={false} cc={{ halo: style.halo }}>
        <label ref={ref} {...rest} className={classes(style.wrapper, rest.className)} data-round={round} data-size={size} data-variant={variant}>
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