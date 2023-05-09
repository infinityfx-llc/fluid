import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidError, FluidStyles } from "@/src/types";
import { Animatable } from "@infinityfx/lively";
import { useLink } from "@infinityfx/lively/hooks";
import { forwardRef } from "react";

const Checkbox = forwardRef(({ styles = {}, error, className, style, ...props }: { styles?: FluidStyles; error?: FluidError; } & React.InputHTMLAttributes<HTMLInputElement>, ref: React.ForwardedRef<HTMLLabelElement>) => {
    const _style = useStyles(styles, {
        '.input': {
            position: 'absolute',
            visibility: 'hidden'
        },

        '.checkbox': {
            width: '1.6em',
            height: '1.6em',
            borderRadius: 'var(--f-radius-sml)',
            border: 'solid 2px var(--f-clr-fg-100)',
            transition: 'background-color .25s, border-color .25s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },

        '.input:enabled + .checkbox': {
            cursor: 'pointer'
        },

        '.input:checked:enabled + .checkbox': {
            backgroundColor: 'var(--f-clr-primary-300)',
            borderColor: 'var(--f-clr-primary-300)'
        },

        '.checkmark': {
            width: '1.2em',
            stroke: 'var(--f-clr-text-200)',
            strokeWidth: 3,
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
        },

        '.input:disabled + .checkbox': {
            backgroundColor: 'var(--f-clr-grey-100)'
        },

        '.input:disabled:checked + .checkbox': {
            backgroundColor: 'var(--f-clr-grey-200)',
            borderColor: 'var(--f-clr-grey-200)'
        },

        '.wrapper[data-error="true"] .input:enabled + .checkbox': {
            borderColor: 'var(--f-clr-error-200)'
        },

        '.wrapper[data-error="true"] .input:checked:enabled + .checkbox': {
            backgroundColor: 'var(--f-clr-error-200)'
        }
    });
    const [link, setLink] = useLink(props.defaultChecked ? 1 : 0);

    return <label ref={ref} className={classes(_style.wrapper, className)} style={style} data-error={!!error}>
        <input {...props} type="checkbox" className={_style.input} onChange={e => {
            setLink(e.target.checked ? 1 : 0, .25);
            props.onChange?.(e);
        }} />

        <div className={_style.checkbox}>
            <svg viewBox="0 0 18 18" className={_style.checkmark}>
                <Animatable animate={{ strokeLength: link }} initial={{ strokeDashoffset: 1 }}>
                    <path d="M 3 9 L 8 13 L 15 5" fill="none" />
                </Animatable>
            </svg>
        </div>
    </label>
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;