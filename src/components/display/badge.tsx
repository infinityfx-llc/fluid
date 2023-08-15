import { classes } from "../../../src/core/utils";
import { useStyles } from "../../../src/hooks";
import { FluidSize, FluidStyles } from "../../../src/types";
import { forwardRef } from "react";

export type BadgeStyles = FluidStyles<'.badge' | '.badge__round' | '.badge__xsm' | '.badge__sml' | '.badge__med' | '.badge__lrg'>;

const Badge = forwardRef(({ children, styles = {}, round = false, size = 'sml', color, ...props }: { styles?: BadgeStyles; round?: boolean; size?: FluidSize; } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.badge': {
            fontWeight: 700,
            color: 'var(--f-clr-text-100)',
            textTransform: 'uppercase',
            backgroundColor: 'var(--f-clr-primary-400)',
            borderRadius: 'var(--f-radius-sml)',
            padding: '.2em .6em'
        },

        '.badge__xsm': {
            fontSize: '.5rem'
        },

        '.badge__sml': {
            fontSize: 'var(--f-font-size-xxs)',
        },

        '.badge__med': {
            fontSize: 'var(--f-font-size-xsm)',
        },

        '.badge__lrg': {
            fontSize: 'var(--f-font-size-sml)',
        },

        '.badge__round': {
            borderRadius: '999px'
        }
    });

    return <div ref={ref} {...props}
        className={classes(
            style.badge,
            style[`badge__${size}`],
            round && style.badge__round,
            props.className
        )}
        style={{ backgroundColor: color, ...props.style }}>
        {children}
    </div>;
});

Badge.displayName = 'Badge';

export default Badge;