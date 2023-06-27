'use client';

import { classes } from '@/src/core/utils';
import useInputProps from '@/src/hooks/use-input-props';
import useStyles from '@/src/hooks/use-styles';
import { FluidSize, FluidStyles } from '@/src/types';
import { Animatable } from '@infinityfx/lively';
import { useLink } from '@infinityfx/lively/hooks';
import { forwardRef, useEffect, useState } from 'react';
import { Halo } from '../feedback';

const Chip = forwardRef(({ children, styles = {}, round = false, size = 'med', checked, defaultChecked, ...props }:
    {
        styles?: FluidStyles;
        round?: boolean;
        size?: FluidSize;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>, ref: React.ForwardedRef<HTMLLabelElement>) => {
    const style = useStyles(styles, {
        '.input': {
            position: 'absolute',
            opacity: 0
        },

        '.wrapper': {
            position: 'relative',
            borderRadius: 'var(--f-radius-sml)'
        },

        '.chip': {
            backgroundColor: 'var(--f-clr-fg-100)',
            fontSize: 'var(--f-font-size-xsm)',
            color: 'var(--f-clr-text-100)',
            fontWeight: 600,
            padding: '.5em',
            paddingRight: '.7em',
            borderRadius: 'var(--f-radius-sml)',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xsm)',
            transition: 'background-color .15s'
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
            width: '1.1em',
            stroke: 'var(--f-clr-text-100)',
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
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

        '.input:checked + .chip': {
            backgroundColor: 'var(--f-clr-primary-100)'
        },

        '.input:disabled + .chip': {
            color: 'var(--f-clr-grey-500)'
        },

        '.input:disabled + .chip .checkmark': {
            stroke: 'var(--f-clr-grey-500)'
        },

        '.input:checked:disabled + .chip': {
            color: 'var(--f-clr-grey-100)',
            backgroundColor: 'var(--f-clr-grey-300)'
        }
    });

    const [split, rest] = useInputProps(props);
    const [link, setLink] = useLink(defaultChecked ? 1 : 0);
    const [state, setState] = checked !== undefined ? [checked] : useState(defaultChecked || false);

    useEffect(() => setLink(state ? 1 : 0, .25), [state]);

    return <Halo hover={false} styles={{ '.halo': { inset: '-.5em' } }}>
        <label ref={ref} {...rest} className={classes(style.wrapper, rest.className)} data-round={round} data-size={size}>
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