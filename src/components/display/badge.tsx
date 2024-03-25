import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, FluidStyles, Selectors } from "../../../src/types";
import { forwardRef } from "react";
import { createStyles } from "../../core/style";

export type BadgeStyles = FluidStyles<'.badge' | '.badge__var__default' | '.badge__var__neutral' | '.badge__round' | '.badge__xsm' | '.badge__sml' | '.badge__med' | '.badge__lrg'>;

const Badge = forwardRef(({ children, cc = {}, variant = 'default', round = false, size = 'sml', color, ...props }:
    {
        cc?: Selectors<'badge' | 'badge__round' | 'badge__xsm' | 'badge__sml' | 'badge__med' | 'badge__lrg'>;
        variant?: 'default' | 'neutral';
        round?: boolean;
        size?: FluidSize;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('badge', {
        '.badge': {
            fontWeight: 700,
            color: 'var(--f-clr-text-100)',
            borderRadius: 'var(--f-radius-sml)',
            padding: '.2em .6em'
        },

        '.badge__var__default': {
            backgroundColor: 'var(--f-clr-primary-300)'
        },

        '.badge__var__neutral': {
            backgroundColor: 'var(--f-clr-fg-100)',
            border: 'solid 1px var(--f-clr-fg-200)'
        },

        '.badge__xsm': {
            fontSize: '.6rem'
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
    const style = combineClasses(styles, cc);

    return <div ref={ref} {...props}
        className={classes(
            style.badge,
            style[`badge__var__${variant}`],
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