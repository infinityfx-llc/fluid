'use client';

import { classes } from '../../../src/core/utils';
import useInputProps from '../../../src/hooks/use-input-props';
import useStyles from '../../../src/hooks/use-styles';
import { FluidError, FluidInputvalue, FluidSize, FluidStyles } from '../../../src/types';
import { forwardRef, useId } from 'react';

export type FieldProps = {
    defaultValue?: FluidInputvalue;
    styles?: FluidStyles;
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

const Field = forwardRef(({ styles = {}, round = false, size = 'med', error, showError, icon, label, left, right, onEnter, inputRef, ...props }: FieldProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
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
            transition: 'border-color .2s, color .2s',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden'
        },

        '.content': {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xsm)',
            padding: '.6em',
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
            color: 'var(--f-clr-primary-100)'
        },

        '.field[data-error="true"]': {
            borderColor: 'var(--f-clr-error-100)'
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

        '.wrapper[data-size="xsm"]': {
            fontSize: 'var(--f-font-size-xxs)'
        },

        '.wrapper[data-size="sml"]': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.wrapper[data-size="med"]': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.wrapper[data-size="lrg"]': {
            fontSize: 'var(--f-font-size-med)'
        },

        '.field[data-round="true"]': {
            borderRadius: '999px'
        }
    });

    const id = useId();
    const [split, rest] = useInputProps(props);

    return <div ref={ref} {...rest} className={classes(style.wrapper, props.className)} data-size={size}>
        {label && <div id={id} className={style.label}>{label}{props.required ? ' *' : ''}</div>}

        <div className={style.field} data-error={!!error} data-disabled={props.disabled} data-round={round}>
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