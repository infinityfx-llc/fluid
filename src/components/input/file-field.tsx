'use client';

import { useRef, useState } from 'react';
import Button from './button';
import useInputProps from '../../../src/hooks/use-input-props';
import { FluidSize, Selectors } from '../../../src/types';
import { classes, combineClasses, combineRefs } from '../../../src/core/utils';
import { createStyles } from '../../core/style';
import { Icon } from '../../core/icons';
import { FieldProps } from './field';

const styles = createStyles('file-field', {
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
        borderRadius: 'var(--f-radius-sml)',
        color: 'var(--f-clr-grey-200)',
        transition: 'background-color .2s, border-color .2s, color .2s, outline-color .2s',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        outline: 'solid 3px transparent',
        minWidth: 'min(var(--width, 100vw), 12em)'
    },

    '.v__default': {
        border: 'solid 1px var(--f-clr-fg-200)'
    },

    '.v__minimal': {
        backgroundColor: 'var(--f-clr-fg-100)'
    },

    '.content': {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xsm)',
        padding: '.675em',
        flexGrow: 1
    },

    '.v__default:focus-within': {
        borderColor: 'var(--f-clr-primary-100)',
        color: 'var(--f-clr-primary-100)',
        outlineColor: 'var(--f-clr-primary-500)'
    },

    '.v__minimal:focus-within': {
        backgroundColor: 'var(--f-clr-fg-200)'
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

    '.field.round': {
        borderRadius: 'calc(1.4em + 1px)'
    },

    '.button': {
        marginRight: '.25em'
    }
});

export type FileFieldSelectors = Selectors<'input' | 'placeholder' | 'field' | 'content' | 's__xsm' | 's__sml' | 's__med' | 's__lrg' | 'round'>;

/**
 * An input used for selecting files.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/file-field}
 */
export default function FileField({ cc = {}, size = 'med', variant = 'default', round, icon, error, loading = false, inputRef, ...props }:
    {
        cc?: FileFieldSelectors;
        loading?: boolean;
    } & Omit<FieldProps, 'defaultValue' | 'type' | 'left' | 'right' | 'onEnter' | 'shape'>) {
    const style = combineClasses(styles, cc);

    const [files, setFiles] = useState<File[]>([]);

    const input = useRef<HTMLInputElement>(null);
    const [split, rest] = useInputProps(props);

    return <label
        {...rest}
        className={classes(
            style.field,
            style[`s__${size}`],
            style[`v__${variant}`],
            round && style.round,
            props.className
        )}
        data-error={!!error}
        data-disabled={props.disabled}
        data-fb={variant === 'default' ? 'true' : undefined}>

        <div className={style.content}>
            {icon}

            <input
                {...split}
                ref={combineRefs(input, inputRef)}
                type="file"
                className={style.input}
                disabled={props.disabled || loading}
                aria-invalid={!!error}
                onChange={e => {
                    setFiles?.(Array.from(e.target.files || []));
                    props.onChange?.(e);
                }} />

            <input
                readOnly
                role="none"
                tabIndex={-1}
                className={style.placeholder}
                placeholder={split.placeholder}
                value={files.map(file => file.name)} />
        </div>

        <Button
            compact
            aria-label={split['aria-label']}
            aria-labelledby={split['aria-labelledby']}
            disabled={props.disabled}
            round={round}
            size={size}
            loading={loading}
            cc={{
                button: style.button,
                ...cc
            }}
            onClick={() => input.current?.click()}>
            <Icon type="upload" />
        </Button>
    </label>;
}