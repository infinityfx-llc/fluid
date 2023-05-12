import useStyles from "@/src/hooks/use-styles";
import { forwardRef } from "react";
import Halo from "../feedback/halo";
import { classes } from "@/src/core/utils";
import { FluidSize, FluidStyles } from "@/src/types";
import Spinner from "../feedback/spinner";

const Button = forwardRef(({ children, styles = {}, round = false, size = 'med', variant = 'default', loading = false, ...props }: { children: React.ReactNode; styles?: FluidStyles; round?: boolean; size?: FluidSize; variant?: 'default' | 'alternate' | 'minimal'; loading?: boolean; } & React.ButtonHTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const style = useStyles(styles, {
        '.button': {
            position: 'relative',
            border: 'none',
            outline: 'none',
            borderRadius: 'var(--f-radius-sml)',
            padding: '.5em .7em',
            backgroundColor: 'var(--f-clr-primary-100)',
            color: 'var(--f-clr-text-100)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },

        '.button[data-round="true"]': {
            borderRadius: '999px'
        },

        '.button[data-size="sml"]': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.button[data-size="med"]': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.button[data-size="lrg"]': {
            fontSize: 'var(--f-font-size-med)'
        },

        '.button[data-variant="default"]': {
            color: 'var(--f-clr-text-200)'
        },

        '.button[data-variant="alternate"]': {
            backgroundColor: 'var(--f-clr-primary-500)'
        },

        '.button[data-loading="false"]:disabled': {
            color: 'var(--f-clr-grey-400)',
            backgroundColor: 'var(--f-clr-grey-100)'
        },

        '.button[data-variant="minimal"]': {
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

        '.button[data-variant="default"] .loader': {
            stroke: 'var(--f-clr-text-200) !important'
        }
    });

    return <Halo disabled={props.disabled || loading}>
        <button ref={ref} {...props} type={props.type || 'button'} disabled={props.disabled || loading} className={classes(style.button, props.className)} data-round={round} data-size={size} data-variant={variant} data-loading={loading}>
            <span className={style.content}>{children}</span>

            {loading && <Spinner className={style.loader} />}
        </button>
    </Halo>;
});

Button.displayName = 'Button';

export default Button;