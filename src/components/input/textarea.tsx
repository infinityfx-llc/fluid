'use client';

import { classes, combineClasses } from '../../../src/core/utils';
import useInputProps from '../../../src/hooks/use-input-props';
import { FluidSize, Selectors } from '../../../src/types';
import { useState } from 'react';
import Scrollarea from '../layout/scrollarea';
import { createStyles } from '../../core/style';

const styles = createStyles('textarea', {
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

    '.textarea': {
        outline: 'solid 3px transparent',
        backgroundColor: 'var(--f-clr-bg-200)',
        border: 'solid 1px var(--f-clr-fg-200)',
        borderRadius: 'var(--f-radius-sml)',
        transition: 'border-color .2s, outline-color .2s',
        minWidth: 'min(var(--width, 100vw), 12em)'
    },

    '.textarea:focus-within': {
        borderColor: 'var(--f-clr-primary-100)',
        outlineColor: 'var(--f-clr-primary-500)'
    },

    '.input': {
        width: '100%',
        minHeight: 'calc(100% - 2px)',
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

export type TextareaSelectors = Selectors<'textarea' | 'input' | 's__xsm' | 's__sml' | 's__med' | 's__lrg'>;

/**
 * A form textarea.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/textarea}
 */
export default function Textarea({ cc = {}, size = 'med', error, resize = 'both', ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: TextareaSelectors;
        size?: FluidSize;
        error?: any;
        resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'children' | 'cols'>) {
    const style = combineClasses(styles, cc);

    const [split, rest] = useInputProps(props);
    const [rows, setRows] = useState(1);

    return <Scrollarea
        {...rest}
        className={classes(
            style.textarea,
            style[`s__${size}`],
            props.className
        )}
        data-error={!!error}
        data-disabled={props.disabled}
        style={{
            resize,
            height: `${(props.rows || 2) * 2}em`
        }}>
        <textarea
            {...split}
            rows={rows}
            className={style.input}
            aria-invalid={!!error}
            onChange={e => {
                // update the row count based on the amount of newline characters
                split.onChange?.(e);

                setRows(e.target.value.split(/\n/g).length);
            }} />
    </Scrollarea>;
}