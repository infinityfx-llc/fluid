'use client';

import { classes, combineClasses } from '../../../src/core/utils';
import useInputProps from '../../../src/hooks/use-input-props';
import { FluidError, FluidSize, Selectors } from '../../../src/types';
import { useId, useState } from 'react';
import Scrollarea from '../layout/scrollarea';
import { createStyles } from '../../core/style';

const styles = createStyles('textarea', {
    '.wrapper': {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--f-spacing-xxs)',
        minWidth: 'min(100%, 12em)'
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

    '.label': {
        fontSize: '.8em',
        fontWeight: 500,
        color: 'var(--f-clr-text-100)'
    },

    '.textarea': {
        outline: 'solid 3px transparent',
        backgroundColor: 'var(--f-clr-fg-100)',
        border: 'solid 1px var(--f-clr-fg-200)',
        borderRadius: 'var(--f-radius-sml)',
        transition: 'border-color .2s, outline-color .2s',
        width: '100%'
    },

    '.textarea:focus-within': {
        borderColor: 'var(--f-clr-primary-100)',
        outlineColor: 'var(--f-clr-primary-500)'
    },

    '.input': {
        width: 'inherit',
        minHeight: 'calc(100% - 3px)',
        resize: 'none',
        outline: 'none',
        border: 'none',
        background: 'none',
        overflow: 'visible',
        padding: '.6em',
        color: 'var(--f-clr-text-100)'
    },

    '.textarea[data-error="true"]': {
        borderColor: 'var(--f-clr-error-100)'
    },

    '.textarea[data-error="true"]:focus-within': {
        outlineColor: 'var(--f-clr-error-400)'
    },

    '.textarea[data-error="true"] .input': {
        color: 'var(--f-clr-error-200)'
    },

    '.textarea[data-disabled="true"]': {
        backgroundColor: 'var(--f-clr-grey-100)',
        borderColor: 'var(--f-clr-grey-200)'
    },

    '.textarea[data-disabled="true"] .input': {
        color: 'var(--f-clr-grey-500)'
    }
});

export type TextareaSelectors = Selectors<'wrapper' | 'label' | 'textarea' | 'input' | 's__xsm' | 's__sml' | 's__med' | 's__lrg'>;

export default function Textarea({ cc = {}, label, error, size = 'med', resize = 'both', ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: TextareaSelectors;
        label?: string;
        error?: FluidError;
        size?: FluidSize;
        resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'children' | 'cols'>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const [split, rest] = useInputProps(props);
    const [rows, setRows] = useState(1);

    return <div {...rest}
        className={classes(
            style.wrapper,
            style[`s__${size}`],
            props.className
        )}>
        {label && <div id={id} className={style.label}>{label}{props.required ? ' *' : ''}</div>}

        <Scrollarea className={style.textarea} style={{ resize, height: `${(props.rows || 2) * 2}em` }} data-error={!!error} data-disabled={props.disabled}>
            <textarea {...split} rows={rows}
                className={style.input}
                aria-labelledby={label ? id : undefined}
                aria-invalid={!!error}
                onChange={e => {
                    split.onChange?.(e);

                    setRows(e.target.value.split(/\n/g).length);
                }} />
        </Scrollarea>
    </div>;
}