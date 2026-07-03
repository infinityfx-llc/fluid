'use client';

import { useRef, useState } from 'react';
import Button from './button';
import useInputProps from '../../../src/hooks/use-input-props';
import { Selectors } from '../../../src/types';
import { classes, combineClasses, combineRefs } from '../../../src/core/utils';
import { createStyles } from '../../core/style';
import { Icon } from '../../core/icons';
import Spinner from '../feedback/spinner';
import Interactable from '../feedback/interactable';

const styles = createStyles('drop-zone', {
    '.zone': {
        overflow: 'hidden',
        position: 'relative',
        display: 'grid',
        backgroundColor: 'var(--f-clr-surface-100)',
        border: 'dashed 1px var(--f-clr-surface-200)',
        borderRadius: 'var(--f-radius-med)',
        transition: 'background-color .25s, border-color .25s, color .25s',
        userSelect: 'none'
    },

    '.zone[aria-disabled="false"]': {
        cursor: 'pointer'
    },

    '.zone.hovering': {
        backgroundColor: 'var(--f-clr-primary-600)',
        borderColor: 'var(--f-clr-primary-100)'
    },

    '.zone.filled': {
        borderStyle: 'solid'
    },

    '.zone.error, .zone.rejected': {
        borderColor: 'var(--f-clr-error-100)',
        color: 'var(--f-clr-error-100)'
    },

    '.zone.rejected': {
        backgroundColor: 'var(--f-clr-error-400)'
    },

    '.zone.disabled': {
        color: 'var(--f-clr-grey-500)'
    },

    '.container': {
        display: 'flex',
        flexDirection: 'column',
        gridArea: '1 / 1'
    },

    '.preview': {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--f-clr-bg-100)',
        padding: 'var(--f-spacing-med)',
        flexGrow: 1
    },

    '.footer': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--f-spacing-sml)',
        gap: 'var(--f-spacing-sml)'
    },

    '.text': {
        display: 'flex',
        alignItems: 'baseline',
        gap: 'var(--f-spacing-xsm)'
    },

    '.annotation': {
        paddingTop: 'var(--f-spacing-xxs)',
        color: 'var(--f-clr-grey-600)',
        fontSize: 'var(--f-font-size-xsm)'
    },

    '.icon': {
        paddingBottom: 'var(--f-spacing-sml)'
    },

    '.image': {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 1
    },

    '.container.centered': {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--f-spacing-lrg)'
    },

    '.input': {
        position: 'absolute',
        opacity: 0,
        pointerEvents: 'none'
    }
});

export type DropZoneSelectors = Selectors<'zone' | 'hovering' | 'filled' | 'error' | 'disabled' | 'rejected' | 'container' | 'preview' | 'footer' | 'text' | 'annotation' | 'icon' | 'image' | 'centered'>;

function formatFileSize(bytes: number) {
    bytes /= 1024;

    return bytes < 1000 ?
        `${bytes.toFixed(1)} KB` :
        `${(bytes / 1024).toFixed(1)} MB`;
}

function validFileType(file: File, types: string) {
    const list = types ? types.split(',') : [];

    return list.length ?
        list.some(type => file.type.includes(type.trim().replace(/\/\*$/, ''))) :
        true;
}

/**
 * An input that allows for drag and dropping files.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/drop-zone}
 */
export default function DropZone({ cc = {}, loading = false, error, text = 'Drop files or click to browse', annotation, icon, previewImages = false, fallbackPreviewImage, inputRef, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: DropZoneSelectors;
        loading?: boolean;
        error?: any;
        text?: string;
        annotation?: string;
        icon?: React.ReactNode;
        /**
         * Show a preview when an image file is selected.
         * 
         * @default false
         */
        previewImages?: boolean;
        /**
         * Optional fallback image to show as a preview when no file is selected.
         */
        fallbackPreviewImage?: string;
        inputRef?: React.Ref<HTMLInputElement>;
        onChange?: React.ChangeEventHandler<HTMLInputElement>;
    } & Omit<React.InputHTMLAttributes<HTMLDivElement>, 'defaultValue' | 'children' | 'onChange'>) {
    const style = combineClasses(styles, cc);

    const input = useRef<HTMLInputElement>(null);
    const [hovering, setHovering] = useState(false);
    const [rejected, setRejected] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [split, rest] = useInputProps(props);

    function updateFile(file: File | null) {
        if (!input.current) return;
        const transfer = new DataTransfer();

        if (file) transfer.items.add(file);

        setFile(file);
        input.current.files = transfer.files;
        input.current.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const preview = !!(previewImages && file && validFileType(file, 'image/*'));
    const isDisabled = props.disabled || props.readOnly || loading;
    const hasContent = file || (previewImages && fallbackPreviewImage);

    return <Interactable
        {...rest}
        as="div"
        role="button"
        tabIndex={0}
        highlightColor="var(--f-clr-grey-300)"
        disabled={!!file || isDisabled}
        aria-disabled={!!file || isDisabled}
        className={classes(
            style.zone,
            hovering && style.hovering,
            error && style.error,
            rejected && style.rejected,
            hasContent && style.filled,
            props.disabled && style.disabled,
            props.className
        )}
        onClick={e => {
            props.onClick?.(e);
            if (!file && !isDisabled && input.current) input.current.click();
        }}
        onDragOver={e => {
            props.onDragOver?.(e);
            e.preventDefault();

            if (!isDisabled) setHovering(true);
        }}
        onDragLeave={e => {
            props.onDragLeave?.(e);
            setHovering(false);
        }}
        onDrop={e => {
            props.onDrop?.(e);
            if (isDisabled) return;

            e.preventDefault();
            setHovering(false);

            const file = e.dataTransfer.files[0];
            if (file && !validFileType(file, props.accept || '')) {
                setRejected(true);
                setTimeout(() => setRejected(false), 250);
            } else
                if (file) updateFile(file);
        }}>
        {loading && <div className={classes(style.container, style.centered)}>
            <Spinner />
        </div>}

        {hasContent && !loading && <>
            <div className={style.container}>
                <div className={style.preview}>
                    <Icon type="file" />

                    {(preview || fallbackPreviewImage) && <img src={file ? URL.createObjectURL(file) : fallbackPreviewImage} className={style.image} />}
                </div>

                {file && <div className={style.footer}>
                    <div>
                        <div className={style.text}>
                            {file.name}
                        </div>

                        <div className={style.annotation}>
                            {formatFileSize(file.size)}
                        </div>
                    </div>

                    <Button
                        compact
                        variant="minimal"
                        disabled={isDisabled}
                        onClick={() => updateFile(null)}>
                        <Icon type="close" />
                    </Button>
                </div>}
            </div>
        </>}

        {<div
            style={hasContent || loading ? {
                opacity: 0,
                pointerEvents: 'none'
            } : undefined}
            className={classes(style.container, style.centered)}>
            <div className={style.icon}>
                {icon || <Icon type="upload" />}
            </div>

            <div className={style.text}>
                {text}
            </div>

            {annotation && <div className={style.annotation}>
                {annotation}
            </div>}
        </div>}

        <input
            {...split}
            ref={combineRefs(input, inputRef)}
            type="file"
            disabled={props.disabled || loading}
            aria-invalid={!!error}
            className={style.input}
            onChange={e => {
                props.onChange?.(e);
                setFile(e.target.files?.[0] || null);
            }} />
    </Interactable>;
}