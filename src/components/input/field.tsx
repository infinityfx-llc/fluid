'use client';

import { classes, combineClasses } from '../../../src/core/utils';
import useInputProps from '../../../src/hooks/use-input-props';
import { FluidError, FluidInputvalue, FluidSize, Selectors } from '../../../src/types';
import { useId } from 'react';
import { createStyles } from '../../core/style';

const styles = createStyles('field', {
    '.wrapper': {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--f-spacing-xxs)',
        minWidth: 'min(100vw, 12em)'
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

    '.wrapper.round .field': {
        borderRadius: '999px'
    }
});

export type FieldSelectors = Selectors<'wrapper' | 'input' | 'field' | 'content' | 'label' | 'error' | 's__xsm' | 's__sml' | 's__med' | 's__lrg' | 'round'>;

export type FieldProps = {
    ref?: React.Ref<HTMLDivElement>;
    defaultValue?: FluidInputvalue;
    cc?: FieldSelectors;
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

export default function Field({ cc = {}, round = false, size = 'med', error, showError, icon, label, left, right, onEnter, inputRef, ...props }: FieldProps) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const [split, rest] = useInputProps(props);

    return <div {...rest} className={classes(
        style.wrapper,
        style[`s__${size}`],
        round && style.round,
        props.className
    )}>
        {label && <div id={id} className={style.label}>{label}{props.required ? ' *' : ''}</div>}

        <div className={style.field} data-error={!!error} data-disabled={props.disabled}>
            {left}

            <label className={style.content}>
                {icon}

                <input
                    {...split}
                    className={style.input}
                    ref={inputRef}
                    aria-labelledby={label ? id : undefined}
                    aria-invalid={!!error}
                    onKeyDown={e => {
                        if (e.key === 'Enter') onEnter?.();
                    }} />
            </label>

            {right}
        </div>

        {typeof error === 'string' && showError && error.length ? <div className={style.error}>{error}</div> : null}
    </div>;
}