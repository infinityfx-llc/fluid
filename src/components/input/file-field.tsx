'use client';

import { forwardRef, useId, useRef, useState } from 'react';
import Button from './button';
import { MdUpload } from 'react-icons/md';
import useStyles from '@/src/hooks/use-styles';
import useInputProps from '@/src/hooks/use-input-props';
import { FluidError, FluidSize, FluidStyles } from '@/src/types';
import { classes } from '@/src/core/utils';

const FileField = forwardRef(({ styles = {}, size, round, icon, label, error, loading = false, ...props }:
    {
        styles?: FluidStyles;
        round?: boolean;
        size?: FluidSize;
        error?: FluidError;
        loading?: boolean;
        icon?: React.ReactNode;
        label?: string;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'defaultValue' | 'children' | 'type'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.wrapper': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xxs)',
            width: 'clamp(0px, 12em, 100vw)'
        },

        '.input': {
            position: 'absolute',
            opacity: 0
        },

        '.placeholder': {
            color: 'var(--f-clr-text-100)',
            userSelect: 'none',
            flexGrow: 1,
            background: 'none',
            border: 'none',
            width: 0
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

        '.field[data-error="true"] .placeholder': {
            color: 'var(--f-clr-error-200)'
        },

        '.field[data-disabled="true"]': {
            backgroundColor: 'var(--f-clr-grey-100)',
            borderColor: 'var(--f-clr-grey-200)'
        },

        '.field[data-disabled="true"] .placeholder': {
            color: 'var(--f-clr-grey-500)'
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

    const [files, setFiles] = useState<File[]>([]);

    const id = useId();
    const input = useRef<HTMLInputElement | null>(null);
    const [split, rest] = useInputProps(props);

    return <div ref={ref} {...rest} className={classes(style.wrapper, props.className)} data-size={size}>
        {label && <div id={id} className={style.label}>{label}{props.required ? ' *' : ''}</div>}

        <label className={style.field} data-error={!!error} data-disabled={props.disabled} data-round={round}>

            <div className={style.content}>
                {icon}

                <input ref={input} {...split} disabled={props.disabled || loading} type="file" aria-labelledby={label ? id : undefined} aria-invalid={!!error} className={style.input} onChange={e => {
                    setFiles?.(Array.from(e.target.files || []));
                    props.onChange?.(e);
                }} />
                <input className={style.placeholder} tabIndex={-1} role="none" value={files.map(file => file.name)} readOnly />
            </div>

            <Button disabled={props.disabled} round={round} size={size} loading={loading} style={{
                marginRight: '.3em'
            }} onClick={() => input.current?.click()}>
                <MdUpload />
            </Button>
        </label>
    </div>;
});

FileField.displayName = 'FileField';

export default FileField;