import useInputProps from '@/src/hooks/use-input-props';
import useStyles from '@/src/hooks/use-styles';
import { FluidError, FluidInputvalue, FluidSize, FluidStyles } from '@/src/types';
import { forwardRef, useId } from 'react';

const Field = forwardRef(({ children, styles = {}, round = false, size = 'med', error, icon, label, left, right, ...props }:
    {
        children?: FluidInputvalue;
        styles?: FluidStyles;
        round?: boolean;
        size?: FluidSize;
        error?: FluidError; 
        icon?: React.ReactNode; 
        label?: string;
        left?: React.ReactNode;
        right?: React.ReactNode;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.wrapper': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xxs)',
            width: 'clamp(0px, 12em, 100vw)'
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
            border: 'solid 1px var(--f-clr-grey-100)',
            borderRadius: 'var(--f-radius-sml)',
            color: 'var(--f-clr-grey-200)',
            transition: 'border-color .2s, color .2s',
            display: 'flex',
            alignItems: 'center'
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

    const id = useId();
    const [split, rest] = useInputProps(props);

    return <div ref={ref} {...rest} className={style.wrapper} data-size={size}>
        {label && <div id={id} className={style.label}>{label}{props.required ? ' *' : ''}</div>}

        <label className={style.field} data-error={error} data-disabled={props.disabled} data-round={round}>
            {left}

            <div className={style.content}>
                {icon}

                <input {...split} aria-labelledby={label ? id : undefined} defaultValue={children} className={style.input} />
            </div>

            {right}
        </label>
    </div>;
});

Field.displayName = 'Field';

export default Field;