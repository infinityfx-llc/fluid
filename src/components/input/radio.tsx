import { classes, combineClasses } from "../../../src/core/utils";
import { FluidError, FluidSize, Selectors } from "../../../src/types";
import Halo from "../feedback/halo";
import useInputProps from "../../../src/hooks/use-input-props";
import { createStyles } from "../../core/style";

const styles = createStyles('radio', {
    '.wrapper': {
        position: 'relative',
        width: 'max-content'
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
        backgroundColor: 'var(--f-clr-fg-100)',
        border: 'solid 1px var(--f-clr-fg-200)',
        transition: 'background-color .25s, border-color .25s'
    },

    '.input:enabled:not(:checked)': {
        cursor: 'pointer'
    },

    '.input:checked:enabled + .radio': {
        backgroundColor: 'var(--color)',
        borderColor: 'var(--color)'
    },

    '.selection': {
        position: 'absolute',
        borderRadius: '999px',
        backgroundColor: 'white',
        scale: 0,
        transition: 'scale .25s ease-out'
    },

    '.s__xsm .selection': {
        inset: '4px'
    },

    '.s__sml .selection': {
        inset: '5px'
    },

    '.s__med .selection': {
        inset: '6px'
    },

    '.s__lrg .selection': {
        inset: '7px'
    },

    '.input:checked + .radio .selection': {
        scale: 1
    },

    '.input:disabled + .radio': {
        backgroundColor: 'var(--f-clr-grey-100)',
        borderColor: 'var(--f-clr-grey-200)'
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

    '.wrapper .halo': {
        borderRadius: '999px',
        inset: '-.5em'
    }
});

export type RadioSelectors = Selectors<'wrapper' | 'input' | 'radio' | 'selection' | 's__xsm' | 's__sml' | 's__med' | 's__lrg'>;

export default function Radio({ cc = {}, error, size = 'med', color = 'var(--f-clr-primary-300)', ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: RadioSelectors;
        error?: FluidError;
        size?: FluidSize;
        color?: string;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>) {
    const style = combineClasses(styles, cc);

    const [split, rest] = useInputProps(props);

    return <Halo hover={false} cc={{ halo: style.halo, ...cc }}>
        <div {...rest}
            className={classes(
                style.wrapper,
                style[`s__${size}`],
                rest.className
            )}
            data-error={!!error}>

            <input {...split} type="radio" className={style.input} aria-invalid={!!error} />

            <div className={style.radio} style={{ '--color': color } as any}>
                <div className={style.selection} />
            </div>
        </div>
    </Halo>;
}