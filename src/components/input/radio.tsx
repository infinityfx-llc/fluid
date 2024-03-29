import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidError, FluidSize, FluidStyles } from "@/src/types";
import { forwardRef } from "react";
import Halo from "../feedback/halo";
import useInputProps from "@/src/hooks/use-input-props";

export type RadioStyles = FluidStyles<'.wrapper' | '.input' | '.radio' | '.selection'>;

const Radio = forwardRef(({ styles = {}, error, size = 'med', ...props }: { styles?: RadioStyles; error?: FluidError; size?: FluidSize; } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.wrapper': {
            position: 'relative'
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
    
        '.input': {
            position: 'absolute',
            opacity: 0,
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
        },
    
        '.radio': {
            position: 'relative',
            width: '1.5em',
            height: '1.5em',
            borderRadius: '999px',
            border: 'solid 2px var(--f-clr-fg-200)',
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
            backgroundColor: 'white',
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
        }
    });

    const [split, rest] = useInputProps(props);

    return <Halo hover={false} styles={{ '.halo': { borderRadius: '999px', inset: '-.5em' } }}>
        <div ref={ref} {...rest} className={classes(style.wrapper, rest.className)} data-size={size} data-error={!!error}>
            <input {...split} type="radio" className={style.input} aria-invalid={!!error} />

            <div className={style.radio}>
                <div className={style.selection} />
            </div>
        </div>
    </Halo>;
});

Radio.displayName = 'Radio';

export default Radio;