import useStyles from "@/src/hooks/use-styles";
import { forwardRef } from "react";
import Halo from "../feedback/halo";
import { classes } from "@/src/core/utils";
import { FluidSize, FluidStyles } from "@/src/types";

const Button = forwardRef(({ children, styles = {}, size = 'med', variant = 'default', ...props }: { children: React.ReactNode; styles?: FluidStyles; size?: FluidSize; variant?: 'default' | 'alternate' | 'minimal'; } & React.ButtonHTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const style = useStyles(styles, {
        '.button': {
            position: 'relative',
            border: 'none',
            outline: 'none',
            borderRadius: 'var(--f-radius-sml)',
            padding: '.5em .6em',
            backgroundColor: 'var(--f-clr-primary-100)',
            color: 'var(--f-clr-text-100)',
            fontWeight: 600
        },

        '.button[data-size="sml"]': {
            fontSize: '.85rem'
        },

        '.button[data-size="med"]': {
            fontSize: '1rem'
        },

        '.button[data-size="lrg"]': {
            fontSize: '1.25rem'
        },

        '.button[data-variant="default"]': {
            color: 'var(--f-clr-text-200)'
        },

        '.button[data-variant="alternate"]': {
            backgroundColor: 'var(--f-clr-primary-500)'
        },

        '.button[data-variant="minimal"]': {
            backgroundColor: 'transparent'
        },

        '.button:enabled:hover': {
            cursor: 'pointer'
        },

        '.layout': {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xsm)',
        }
    });

    return <Halo disabled={props.disabled}>
        <button ref={ref} {...props} type="button" className={classes(style.button, props.className)} data-size={size} data-variant={variant}>
            <span className={style.layout}>{children}</span>
        </button>
    </Halo>;
});

Button.displayName = 'Button';

export default Button;