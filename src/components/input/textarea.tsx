import { classes } from '@/src/core/utils';
import useInputProps from '@/src/hooks/use-input-props';
import useStyles from '@/src/hooks/use-styles';
import { FluidError, FluidSize, FluidStyles } from '@/src/types';
import { forwardRef, useId, useState } from 'react';
import { Scrollarea } from '../layout';

const Textarea = forwardRef(({ styles = {}, label, error, size, resize = 'both', ...props }:
    {
        styles?: FluidStyles;
        label?: string;
        error?: FluidError;
        size?: FluidSize;
        resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.wrapper': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xxs)',
            width: 'clamp(0px, 12em, 100vw)'
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

        '.label': {
            fontSize: '.8em',
            fontWeight: 500,
            color: 'var(--f-clr-text-100)'
        },

        '.textarea': {
            outline: 'none',
            backgroundColor: 'var(--f-clr-fg-100)',
            border: 'solid 1px var(--f-clr-grey-100)',
            borderRadius: 'var(--f-radius-sml)',
            transition: 'border-color .2s',
            width: '100%',
            height: '4em',
            resize
        },

        '.textarea:focus-within': {
            borderColor: 'var(--f-clr-primary-100)'
        },

        '.input': {
            resize: 'none', // (maybe move to data attr / style tag)
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

    const id = useId();
    const [split, rest] = useInputProps(props);
    const [rows, setRows] = useState(1);

    return <div ref={ref} {...rest} className={classes(style.wrapper, props.className)}>
        {label && <div id={id} className={style.label}>{label}{props.required ? ' *' : ''}</div>}

        <Scrollarea className={style.textarea} data-error={!!error} data-disabled={props.disabled}>
            <textarea {...split} rows={rows} className={style.input} aria-labelledby={label ? id : undefined} aria-invalid={!!error} onChange={e => {
                split.onChange?.(e);

                setRows(e.target.value.split(/\n/g).length);
            }} />
        </Scrollarea>
    </div>;
});

Textarea.displayName = 'Textarea';

export default Textarea;