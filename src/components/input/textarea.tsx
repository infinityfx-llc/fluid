'use client';

import { classes, combineClasses } from '../../../src/core/utils';
import useInputProps from '../../../src/hooks/use-input-props';
import { FluidError, FluidSize, FluidStyles, Selectors } from '../../../src/types';
import { forwardRef, useId, useState } from 'react';
import Scrollarea from '../layout/scrollarea';
import { createStyles } from '../../core/style';

export type TextareaStyles = FluidStyles<'.wrapper' | '.label' | '.textarea' | '.input' | '.wrapper__xsm' | '.wrapper__sml' | '.wrapper__med' | '.wrapper__lrg'>;

const Textarea = forwardRef(({ cc = {}, label, error, size = 'med', resize = 'both', ...props }:
    {
        cc?: Selectors<'wrapper' | 'label' | 'textarea' | 'input' | 'wrapper__xsm' | 'wrapper__sml' | 'wrapper__med' | 'wrapper__lrg'>;
        label?: string;
        error?: FluidError;
        size?: FluidSize;
        resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('textarea', {
        '.wrapper': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xxs)',
            minWidth: 'clamp(0px, 12em, 100vw)'
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

        '.label': {
            fontSize: '.8em',
            fontWeight: 500,
            color: 'var(--f-clr-text-100)'
        },

        '.textarea': {
            outline: 'none',
            backgroundColor: 'var(--f-clr-fg-100)',
            border: 'solid 1px var(--f-clr-fg-200)',
            borderRadius: 'var(--f-radius-sml)',
            transition: 'border-color .2s',
            width: '100%',
            height: '4em'
        },

        '.textarea:focus-within': {
            borderColor: 'var(--f-clr-primary-100)'
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
    const style = combineClasses(styles, cc);

    const id = useId();
    const [split, rest] = useInputProps(props);
    const [rows, setRows] = useState(1);

    return <div ref={ref} {...rest} className={classes(
        style.wrapper,
        style[`wrapper__${size}`],
        props.className
    )}>
        {label && <div id={id} className={style.label}>{label}{props.required ? ' *' : ''}</div>}

        <Scrollarea className={style.textarea} style={{ resize }} data-error={!!error} data-disabled={props.disabled}>
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
});

Textarea.displayName = 'Textarea';

export default Textarea;