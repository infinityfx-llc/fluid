'use client';

import { classes, combineClasses } from '../../../src/core/utils';
import useInputProps from '../../../src/hooks/use-input-props';
import { FluidError, FluidInputvalue, FluidSize, FluidStyles, Selectors } from '../../../src/types';
import { forwardRef, useId } from 'react';
import { createStyles } from '../../core/style';

export type FieldProps = {
    defaultValue?: FluidInputvalue;
    cc?: Selectors<'wrapper' | 'input' | 'field' | 'content' | 'label' | 'error' | 'wrapper__xsm' | 'wrapper__sml' | 'wrapper__med' | 'wrapper__lrg' | 'wrapper__round'>;
    round?: boolean;
    size?: FluidSize;
    error?: FluidError;
    showError?: boolean;
    icon?: React.ReactNode;
    label?: string;
    left?: React.ReactNode;
    right?: React.ReactNode;
    onEnter?: () => void;
    inputRef?: React.Ref<HTMLInputElement>;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'defaultValue' | 'children'>;

const Field = forwardRef(({ cc = {}, round = false, size = 'med', error, showError, icon, label, left, right, onEnter, inputRef, ...props }: FieldProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('field', {
        '.wrapper': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xxs)',
            minWidth: 'clamp(0px, 12em, 100vw)'
        },

        '.input': {
            border: 'none',
            background: 'none',
            outline: 'none',
            color: 'var(--f-clr-text-100)',
            width: 0,
            flexGrow: 1
        },

        '.input::placeholder': {
            color: 'var(--f-clr-grey-300)'
        },

        '.field': {
            backgroundColor: 'var(--f-clr-fg-100)',
            border: 'solid 1px var(--f-clr-fg-200)',
            borderRadius: 'var(--f-radius-sml)',
            color: 'var(--f-clr-grey-200)',
            transition: 'border-color .2s, color .2s, outline-color .2s',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            outline: 'solid 3px transparent'
        },

        '.content': {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xsm)',
            padding: '.675em',
            flexGrow: 1
        },

        '.label': {
            fontSize: '.8em',
            fontWeight: 500,
            color: 'var(--f-clr-text-100)'
        },

        '.error': {
            fontSize: '.8em',
            fontWeight: 500,
            color: 'var(--f-clr-error-100)'
        },

        '.field:focus-within': {
            borderColor: 'var(--f-clr-primary-100)',
            color: 'var(--f-clr-primary-100)',
            outlineColor: 'var(--f-clr-primary-500)'
        },

        '.field[data-error="true"]': {
            borderColor: 'var(--f-clr-error-100)'
        },

        '.field[data-error="true"]:focus-within': {
            outlineColor: 'var(--f-clr-error-400)'
        },

        '.field[data-error="true"] .content': {
            color: 'var(--f-clr-error-200)'
        },

        '.field[data-error="true"] .input': {
            color: 'var(--f-clr-error-200)'
        },

        '.field[data-disabled="true"]': {
            backgroundColor: 'var(--f-clr-grey-100)',
            borderColor: 'var(--f-clr-grey-200)'
        },

        '.field[data-disabled="true"] .input': {
            color: 'var(--f-clr-grey-500)'
        },

        '.wrapper__xsm': {
            fontSize: 'var(--f-font-size-xxs)'
        },

        '.wrapper__sml': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.wrapper__med': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.wrapper__lrg': {
            fontSize: 'var(--f-font-size-med)'
        },

        '.wrapper__round .field': {
            borderRadius: '999px'
        }
    });
    const style = combineClasses(styles, cc);

    const id = useId();
    const [split, rest] = useInputProps(props);

    return <div ref={ref} {...rest} className={classes(
        style.wrapper,
        style[`wrapper__${size}`],
        round && style.wrapper__round,
        props.className
    )}>
        {label && <div id={id} className={style.label}>{label}{props.required ? ' *' : ''}</div>}

        <div className={style.field} data-error={!!error} data-disabled={props.disabled}>
            {left}

            <label className={style.content}>
                {icon}

                <input {...split} ref={inputRef} aria-labelledby={label ? id : undefined} aria-invalid={!!error} className={style.input} onKeyDown={e => {
                    if (e.key === 'Enter') onEnter?.();
                }} />
            </label>

            {right}
        </div>

        {typeof error === 'string' && showError && error.length ? <div className={style.error}>{error}</div> : null}
    </div>;
});

Field.displayName = 'Field';

export default Field;