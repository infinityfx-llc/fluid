import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidError, FluidStyles } from "@/src/types";
import { forwardRef } from "react";
import Halo from "../feedback/halo";
import useInputProps from "@/src/hooks/use-input-props";

const Radio = forwardRef(({ styles = {}, error, ...props }: { styles?: FluidStyles; error?: FluidError; } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>, ref: React.ForwardedRef<HTMLLabelElement>) => {
    const style = useStyles(styles, {
        '.wrapper': {
            position: 'relative'
        },
        
        '.input': {
            position: 'absolute',
            opacity: 0
        },

        '.radio': {
            position: 'relative',
            width: '1.6em',
            height: '1.6em',
            borderRadius: '999px',
            border: 'solid 2px var(--f-clr-fg-100)',
            transition: 'background-color .25s, border-color .25s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },

        '.input:enabled:not(:checked) + .radio': {
            cursor: 'pointer'
        },

        '.input:checked:enabled + .radio': {
            backgroundColor: 'var(--f-clr-primary-300)',
            borderColor: 'var(--f-clr-primary-300)'
        },

        '.selection': {
            position: 'absolute',
            inset: '.2em',
            borderRadius: '999px',
            backgroundColor: 'var(--f-clr-text-200)',
            scale: 0,
            transition: 'scale .25s'
        },

        '.input:checked + .radio .selection': {
            scale: 1
        },

        '.input:disabled + .radio': {
            backgroundColor: 'var(--f-clr-grey-100)'
        },

        '.input:disabled:checked + .radio': {
            backgroundColor: 'var(--f-clr-grey-200)',
            borderColor: 'var(--f-clr-grey-200)'
        },

        '.input:disabled + .radio .selection': {
            backgroundColor: 'var(--f-clr-grey-100)'
        },

        '.wrapper[data-error="true"] .input:enabled + .radio': {
            borderColor: 'var(--f-clr-error-200)'
        },

        '.wrapper[data-error="true"] .input:checked:enabled + .radio': {
            backgroundColor: 'var(--f-clr-error-200)'
        },

        '.halo': {
            borderRadius: '999px',
            inset: '-.5em'
        }
    });

    const [split, rest] = useInputProps(props);

    return <Halo className={style.halo} hover={false}>
        <label ref={ref} {...rest} className={classes(style.wrapper, rest.className)} data-error={!!error}>
            <input {...split} type="radio" className={style.input} aria-invalid={!!error} />

            <div className={style.radio}>
                <div className={style.selection} />
            </div>
        </label>
    </Halo>;
});

Radio.displayName = 'Radio';

export default Radio;