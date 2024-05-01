import { forwardRef } from "react";
import Halo from "../feedback/halo";
import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, Selectors } from "../../../src/types";
import Spinner from "../feedback/spinner";
import { createStyles } from "../../core/style";

const styles = createStyles('button', {
    '.button': {
        position: 'relative',
        border: 'none',
        outline: 'none',
        borderRadius: 'var(--f-radius-sml)',
        padding: '.8em',
        backgroundColor: 'var(--f-clr-primary-100)',
        color: 'var(--f-clr-text-100)',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    '.button.compact': {
        padding: '.6em'
    },

    '.button.round': {
        borderRadius: '999px'
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

    '.v__default': {
        color: 'var(--f-clr-text-200)'
    },

    '.v__light': {
        backgroundColor: 'var(--f-clr-primary-500)'
    },

    '.v__neutral': {
        backgroundColor: 'var(--f-clr-fg-100)',
        border: 'solid 1px var(--f-clr-fg-200)'
    },

    '.button[data-loading="false"]:disabled': {
        color: 'var(--f-clr-grey-400)',
        backgroundColor: 'var(--f-clr-grey-100)'
    },

    '.v__minimal': {
        backgroundColor: 'transparent'
    },

    '.button:enabled:hover': {
        cursor: 'pointer'
    },

    // '.button:enabled:active': {
    //     translate: '0px 1px'
    // },

    '.content': {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xsm)',
        lineHeight: 1
    },

    '.button[data-loading="true"] .content': {
        opacity: 0
    },

    '.loader': {
        position: 'absolute'
    }
});

export type ButtonSelectors = Selectors<'button' | 'content' | 'loader' | 'round' | 'compact' | 's__xsm' | 's__sml' | 's__med' | 's__lrg' | 'v__default' | 'v__neutral' | 'v__light' | 'v__minimal'>;

const Button = forwardRef(({ children, cc = {}, round = false, compact = false, size = 'med', variant = 'default', loading = false, ...props }:
    {
        cc?: ButtonSelectors;
        round?: boolean;
        compact?: boolean;
        size?: FluidSize;
        variant?: 'default' | 'neutral' | 'light' | 'minimal';
        loading?: boolean;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const style = combineClasses(styles, cc);

    return <Halo disabled={props.disabled || loading}>
        <button ref={ref} {...props}
            type={props.type || 'button'}
            disabled={props.disabled || loading}
            className={classes(
                style.button,
                round && style.round,
                compact && style.compact,
                style[`s__${size}`],
                style[`v__${variant}`],
                props.className
            )}
            data-loading={loading}>
            <span className={style.content}>{children}</span>

            {loading && <Spinner className={style.loader} />}
        </button>
    </Halo>;
});

Button.displayName = 'Button';

export default Button;