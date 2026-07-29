'use client';

import { classes, combineClasses } from '../../../src/core/utils';
import { FluidSize, Selectors } from '../../../src/types';
import { useRef, useState } from 'react';
import useInputProps from '../../../src/hooks/use-input-props';
import { createStyles } from '../../core/style';
import { Animate } from '@infinityfx/lively';
import Interactable from '../feedback/interactable';

const styles = createStyles('switch', {
    '.wrapper': {
        position: 'relative',
        width: 'max-content'
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
        zIndex: 2,
        WebkitTapHighlightColor: 'transparent'
    },

    '.input:enabled': {
        cursor: 'pointer'
    },

    '.switch': {
        position: 'relative',
        height: '1.5em',
        width: 'calc(calc(1.5em - 6px) * 2 + 6px)',
        padding: '3px',
        aspectRatio: 2,
        backgroundColor: 'var(--f-clr-surface-200)',
        borderRadius: 'var(--f-radius-sml)',
        transition: 'background-color .35s'
    },

    '.icons': {
        position: 'absolute',
        inset: 0,
        display: 'flex'
    },

    '.icon': {
        flexGrow: 1,
        flexBasis: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '.75em'
    },

    '.icon:first-child': {
        color: 'white'
    },

    '.icon:last-child': {
        color: 'var(--f-clr-grey-400)'
    },

    '.handle__wrapper': {
        position: 'relative',
        borderRadius: 'calc(var(--f-radius-sml) - 1px)',
        height: '100%',
        aspectRatio: 1,
        zIndex: 1,
    },

    '.handle': {
        width: 'inherit',
        height: 'inherit',
        borderRadius: 'inherit',
        backgroundColor: 'white',
        boxShadow: 'var(--f-shadow-sml)'
    },

    '.wrapper.round .switch': {
        borderRadius: '999px'
    },

    '.wrapper.round .handle__wrapper': {
        borderRadius: '999px'
    },

    '.wrapper[data-error="true"] .input:enabled + .switch': {
        backgroundColor: 'var(--f-clr-error-400)'
    },

    '.input:checked:enabled + .switch': {
        backgroundColor: 'var(--color, var(--f-clr-primary-300))'
    },

    '.wrapper[data-error="true"] .input:checked:enabled + .switch': {
        backgroundColor: 'var(--f-clr-error-200)'
    },

    '.input:disabled + .switch .handle': {
        backgroundColor: 'var(--f-clr-grey-200)'
    },

    '.wrapper .highlight': {
        borderRadius: 'var(--f-radius-med)',
        inset: '-.5em'
    },

    '.wrapper.round .highlight': {
        borderRadius: '999px'
    }
});

export type SwitchSelectors = Selectors<'wrapper' | 'input' | 'switch' | 'icons' | 'icon' | 'handle' | 's__xsm' | 's__sml' | 's__med' | 's__lrg' | 'round'>;

/**
 * An input that switches between an on and off state.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/switch}
 */
export default function Switch({ cc = {}, error, size = 'med', color, round = true, iconOff, iconOn, checked, defaultChecked, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: SwitchSelectors;
        error?: any;
        size?: FluidSize;
        color?: string;
        round?: boolean;
        iconOff?: React.ReactNode;
        iconOn?: React.ReactNode;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>) {
    const style = combineClasses(styles, cc);

    const [split, rest] = useInputProps(props);
    const [state, setState] = checked !== undefined ? [checked] : useState(defaultChecked || false);
    const inputRef = useRef<HTMLInputElement>(null);

    return <div {...rest}
        className={classes(
            style.wrapper,
            style[`s__${size}`],
            round && style.round,
            rest.className
        )}
        data-error={!!error}>
        <input
            {...split}
            ref={inputRef}
            role="switch"
            type="checkbox"
            className={style.input}
            aria-invalid={!!error}
            checked={state}
            onChange={e => {
                setState?.(e.target.checked);
                props.onChange?.(e);
            }} />

        <div className={style.switch} style={{ '--color': color } as any}>
            <div className={style.icons} aria-hidden>
                <div className={style.icon}>
                    {iconOn}
                </div>

                <div className={style.icon}>
                    {iconOff}
                </div>
            </div>

            <Animate
                correction="none"
                animate={{
                    translate: state ? '100% 0%' : '0% 0%',
                    duration: .3
                }}>
                <Interactable
                    as="div"
                    noHover
                    interactTarget={inputRef}
                    cc={{ ...cc, highlight: style.highlight }}
                    className={style.handle__wrapper}>
                    <Animate
                        transition={{ cache: [] }}
                        animate={{
                            scale: [1, '1.6 1', 1],
                            duration: .3,
                            composite: 'override'
                        }}
                        triggers={{
                            animate: [state, !state]
                        }}>
                        <div className={style.handle} />
                    </Animate>
                </Interactable>
            </Animate>
        </div>
    </div>;
}