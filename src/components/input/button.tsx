import useStyles from "../../../src/hooks/use-styles";
import { forwardRef } from "react";
import Halo from "../feedback/halo";
import { classes } from "../../../src/core/utils";
import { FluidSize, FluidStyles } from "../../../src/types";
import Spinner from "../feedback/spinner";

export type ButtonStyles = FluidStyles<'.button' | '.content' | '.loader' | '.button__round' | '.button__xsm' | '.button__sml' | '.button__med' | '.button__lrg' | '.button__var__default' | '.button__var__neutral' | '.button__var__light' | '.button__var__minimal'>;

const Button = forwardRef(({ children, styles = {}, round = false, size = 'med', variant = 'default', loading = false, ...props }:
    {
        styles?: ButtonStyles;
        round?: boolean;
        size?: FluidSize;
        variant?: 'default' | 'neutral' | 'light' | 'minimal';
        loading?: boolean;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const style = useStyles(styles, {
        '.button': {
            position: 'relative',
            border: 'none',
            outline: 'none',
            borderRadius: 'var(--f-radius-sml)',
            padding: '.6em',
            backgroundColor: 'var(--f-clr-primary-100)',
            color: 'var(--f-clr-text-100)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },

        '.button__round': {
            borderRadius: '999px'
        },

        '.button__xsm': {
            fontSize: 'var(--f-font-size-xxs)'
        },

        '.button__sml': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.button__med': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.button__lrg': {
            fontSize: 'var(--f-font-size-med)'
        },

        '.button__var__default': {
            color: 'var(--f-clr-text-200)'
        },

        '.button__var__light': {
            backgroundColor: 'var(--f-clr-primary-500)'
        },

        '.button__var__neutral': {
            backgroundColor: 'var(--f-clr-bg-100)',
            border: 'solid 1px var(--f-clr-fg-200)'
        },

        '.button[data-loading="false"]:disabled': {
            color: 'var(--f-clr-grey-400)',
            backgroundColor: 'var(--f-clr-grey-100)'
        },

        '.button__var__minimal': {
            backgroundColor: 'transparent'
        },

        '.button:enabled:hover': {
            cursor: 'pointer'
        },

        '.content': {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xsm)'
        },

        '.button[data-loading="true"] .content': {
            opacity: 0
        },

        '.loader': {
            position: 'absolute'
        },

        '.button__var__default .loader': {
            stroke: 'var(--f-clr-text-200) !important'
        }
    });

    return <Halo disabled={props.disabled || loading}>
        <button ref={ref} {...props} type={props.type || 'button'} disabled={props.disabled || loading}
            className={classes(
                style.button,
                round && style.button__round,
                style[`button__${size}`],
                style[`button__var__${variant}`],
                props.className
            )} data-loading={loading}>
            <span className={style.content}>{children}</span>

            {loading && <Spinner className={style.loader} />}
        </button>
    </Halo>;
});

Button.displayName = 'Button';

export default Button;