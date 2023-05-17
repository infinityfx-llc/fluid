import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidError, FluidStyles } from "@/src/types";
import { Animatable } from "@infinityfx/lively";
import { useLink } from "@infinityfx/lively/hooks";
import { forwardRef } from "react";
import Halo from "../feedback/halo";
import useInputProps from "@/src/hooks/use-input-props";

const Checkbox = forwardRef(({ styles = {}, error, ...props }: { styles?: FluidStyles; error?: FluidError; } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>, ref: React.ForwardedRef<HTMLLabelElement>) => {
    const style = useStyles(styles, {
        '.wrapper': {
            position: 'relative'
        },
        
        '.input': {
            position: 'absolute',
            opacity: 0
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
            stroke: 'white',
            strokeWidth: 3,
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
        },

        '.input:disabled + .checkbox': {
            backgroundColor: 'var(--f-clr-grey-100)'
        },

        '.input:disabled + .checkbox .checkmark': {
            stroke: 'var(--f-clr-grey-500)'
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
        },

        '.halo': {
            borderRadius: 'var(--f-radius-sml)',
            inset: '-.5em'
        }
    });
    const [link, setLink] = useLink(props.defaultChecked ? 1 : 0);

    const [split, rest] = useInputProps(props);

    return <Halo className={style.halo} hover={false}>
        <label ref={ref} {...rest} className={classes(style.wrapper, rest.className)} data-error={!!error}>
            <input {...split} type="checkbox" className={style.input} aria-invalid={!!error} onChange={e => {
                setLink(e.target.checked ? 1 : 0, .25);
                props.onChange?.(e);
            }} />

            <div className={style.checkbox}>
                <svg viewBox="0 0 18 18" className={style.checkmark}>
                    <Animatable animate={{ strokeLength: link }} initial={{ strokeDashoffset: 1 }}>
                        <path d="M 3 9 L 8 13 L 15 5" fill="none" />
                    </Animatable>
                </svg>
            </div>
        </label>
    </Halo>;
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;