'use client';

import { classes, combineClasses } from '../../../src/core/utils';
import useInputProps from '../../../src/hooks/use-input-props';
import { FluidSize, Selectors } from '../../../src/types';
import Scrollarea from '../layout/scrollarea';
import { createStyles } from '../../core/style';
import { useRef } from 'react';

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
        display: 'flex',
        flexDirection: 'column',
        outline: 'solid 3px transparent',
        borderRadius: 'var(--f-radius-sml)',
        transition: 'border-color .2s, outline-color .2s',
        minWidth: 'min(var(--width, 100vw), 12em)'
    },

    '.v__default': {
        backgroundColor: 'var(--f-clr-surface-100)',
        border: 'solid 1px var(--f-clr-surface-200)'
    },

    '.v__minimal': {
        backgroundColor: 'var(--f-clr-surface-200)',
        border: 'solid 1px transparent'
    },

    '.v__default[data-disabled="false"]:focus-within': {
        borderColor: 'var(--f-clr-primary-100)',
        outlineColor: 'var(--f-clr-primary-500)'
    },

    '.v__minimal[data-disabled="false"]:focus-within': {
        borderColor: 'var(--f-clr-grey-400)',
        outlineColor: 'var(--f-clr-highlight-200)'
    },

    '.container': {
        position: 'relative',
        flexShrink: 0,
        flexGrow: 1,
    },

    '.content': {
        position: 'relative',
        whiteSpace: 'pre-wrap',
        padding: '.6em',
        color: 'transparent'
    },

    '.input': {
        inset: 0,
        width: '100%',
        resize: 'none',
        outline: 'none',
        border: 'none',
        background: 'none',
        overflow: 'hidden',
        padding: '.6em',
        color: 'var(--f-clr-text-100)'
    },

    '.textarea[data-error="true"]': {
        borderColor: 'var(--f-clr-error-100)'
    },

    '.textarea[data-error="true"][data-disabled="false"]:focus-within': {
        outlineColor: 'var(--f-clr-error-400)'
    },

    '.textarea[data-error="true"] .input': {
        color: 'var(--f-clr-error-200)'
    },

    '.textarea[data-disabled="true"]': {
        backgroundColor: 'var(--f-clr-grey-100)'
    },

    '.v__default[data-disabled="true"]': {
        borderColor: 'var(--f-clr-grey-200)'
    },

    '.textarea[data-disabled="true"] .input': {
        color: 'var(--f-clr-grey-500)'
    }
});

export type TextareaSelectors = Selectors<'textarea' | 'container' | 'content' | 'input' | 'v__default' | 'v__minimal' | 's__xsm' | 's__sml' | 's__med' | 's__lrg'>;

/**
 * A form textarea.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/textarea}
 */
export default function Textarea({ cc = {}, size = 'med', variant = 'default', error, resize = 'both', ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: TextareaSelectors;
        size?: FluidSize;
        variant?: 'default' | 'minimal';
        error?: any;
        /**
         * A value of `"auto"` allows the textarea to grow with it contents.
         * 
         * @default "both"
         */
        resize?: 'none' | 'vertical' | 'horizontal' | 'both' | 'auto';
    } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'children' | 'cols'>) {
    const style = combineClasses(styles, cc);

    const content = useRef<HTMLDivElement>(null);
    const [split, rest] = useInputProps(props);
    const fitToContent = resize === 'auto';

    return <Scrollarea
        {...rest}
        className={classes(
            style.textarea,
            style[`s__${size}`],
            style[`v__${variant}`],
            props.className
        )}
        data-error={!!error}
        data-disabled={props.disabled}
        data-fb={variant === 'default' ? 'true' : undefined}
        style={{
            resize: fitToContent ? undefined : resize,
            height: fitToContent ? undefined : `calc(${props.rows || 2}lh + 1.2em)`,
            ...props.style
        }}>
        <div className={style.container}>
            <div
                ref={content}
                className={style.content}
                style={{
                    display: fitToContent ? 'none' : undefined
                }}>
                {split.value || split.defaultValue}
            </div>

            <textarea
                {...split}
                className={style.input}
                style={{
                    position: fitToContent ? 'relative' : 'absolute',
                    minHeight: fitToContent ? `calc(${props.rows || 2}lh + 1.2em)` : '100%',
                    fieldSizing: fitToContent ? 'content' : undefined
                }}
                aria-invalid={!!error}
                onChange={e => {
                    if (!content.current) return;

                    content.current.innerHTML = e.target.value;
                }} />
        </div>
    </Scrollarea>;
}