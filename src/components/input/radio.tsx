import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidError, FluidSize, FluidStyles } from "@/src/types";
import { forwardRef } from "react";
import Halo from "../feedback/halo";
import useInputProps from "@/src/hooks/use-input-props";
import FluidStyleStore from "@/src/core/stylestore";

FluidStyleStore.add('radio', {
    '.wrapper': {
        position: 'relative'
    },
    
    '.input': {
        position: 'absolute',
        opacity: 0,
        inset: 0,
        zIndex: 1
    },

    '.radio': {
        position: 'relative',
        width: '1.5em',
        height: '1.5em',
        borderRadius: '999px',
        border: 'solid 2px var(--f-clr-fg-100)',
        transition: 'background-color .25s, border-color .25s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    '.input:enabled:not(:checked)': {
        cursor: 'pointer'
    },

    '.input:checked:enabled + .radio': {
        backgroundColor: 'var(--f-clr-primary-300)',
        borderColor: 'var(--f-clr-primary-300)'
    },

    '.selection': {
        position: 'absolute',
        inset: '2px',
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
        borderRadius: '999px !important',
        inset: '-.5em !important'
    }
});

const Radio = forwardRef(({ styles = {}, error, size = 'med', ...props }: { styles?: FluidStyles; error?: FluidError; size?: FluidSize; } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, FluidStyleStore.styles.radio);

    const [split, rest] = useInputProps(props);

    return <Halo className={style.halo} hover={false}>
        <div ref={ref} {...rest} className={classes(style.wrapper, rest.className)} data-error={!!error}>
            <input {...split} type="radio" className={style.input} aria-invalid={!!error} />

            <div className={style.radio}>
                <div className={style.selection} />
            </div>
        </div>
    </Halo>;
});

Radio.displayName = 'Radio';

export default Radio;