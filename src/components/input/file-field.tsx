'use client';

import { forwardRef, useId, useRef, useState } from 'react';
import Button from './button';
import { MdUpload } from 'react-icons/md';
import useInputProps from '../../../src/hooks/use-input-props';
import { FluidError, FluidSize, FluidStyles, Selectors } from '../../../src/types';
import { classes, combineClasses, combineRefs } from '../../../src/core/utils';
import { createStyles } from '../../core/style';

const FileField = forwardRef(({ cc = {}, size = 'med', round, icon, label, error, showError, loading = false, inputRef, ...props }:
    {
        cc?: Selectors<'wrapper' | 'input' | 'placeholder' | 'field' | 'content' | 'label' | 'error' | 'wrapper__sml' | 'wrapper__med' | 'wrapper__lrg' | 'wrapper__round'>;
        round?: boolean;
        size?: FluidSize;
        error?: FluidError;
        showError?: boolean;
        loading?: boolean;
        icon?: React.ReactNode;
        label?: string;
        inputRef?: React.Ref<HTMLInputElement>;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'defaultValue' | 'children' | 'type'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('file-field', {
        '.wrapper': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xxs)',
            minWidth: 'clamp(0px, 12em, 100vw)'
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
            width: 0,
            pointerEvents: 'none'
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
            outline: 'solid 3px transparent',
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

    const [files, setFiles] = useState<File[]>([]);

    const id = useId();
    const input = useRef<HTMLInputElement | null>(null);
    const [split, rest] = useInputProps(props);

    return <div ref={ref} {...rest} className={classes(
        style.wrapper,
        style[`wrapper__${size}`],
        round && style.wrapper__round,
        props.className
    )}>
        {label && <div id={id} className={style.label}>{label}{props.required ? ' *' : ''}</div>}

        <label className={style.field} data-error={!!error} data-disabled={props.disabled}>

            <div className={style.content}>
                {icon}

                <input ref={combineRefs(input, inputRef)} {...split} disabled={props.disabled || loading} type="file" aria-labelledby={label ? id : undefined} aria-invalid={!!error} className={style.input} onChange={e => {
                    setFiles?.(Array.from(e.target.files || []));
                    props.onChange?.(e);
                }} />
                <input className={style.placeholder} tabIndex={-1} role="none" value={files.map(file => file.name)} readOnly />
            </div>

            <Button compact aria-label={split['aria-label'] || label} disabled={props.disabled} round={round} size={size} loading={loading}
                style={{
                    marginRight: '.2em'
                }}
                onClick={() => input.current?.click()}>
                <MdUpload />
            </Button>
        </label>

        {typeof error === 'string' && showError && error.length ? <div className={style.error}>{error}</div> : null}
    </div>;
});

FileField.displayName = 'FileField';

export default FileField;