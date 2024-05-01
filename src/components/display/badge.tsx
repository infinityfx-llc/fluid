import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, Selectors } from "../../../src/types";
import { forwardRef } from "react";
import { createStyles } from "../../core/style";

const styles = createStyles('badge', {
    '.badge': {
        fontWeight: 700,
        color: 'var(--f-clr-text-100)',
        borderRadius: 'var(--f-radius-sml)',
        padding: '.2em .6em'
    },

    '.v__default': {
        backgroundColor: 'var(--f-clr-primary-300)'
    },

    '.v__neutral': {
        backgroundColor: 'var(--f-clr-fg-100)',
        border: 'solid 1px var(--f-clr-fg-200)'
    },

    '.s__xsm': {
        fontSize: '.6rem'
    },

    '.s__sml': {
        fontSize: 'var(--f-font-size-xxs)',
    },

    '.s__med': {
        fontSize: 'var(--f-font-size-xsm)',
    },

    '.s__lrg': {
        fontSize: 'var(--f-font-size-sml)',
    },

    '.badge.round': {
        borderRadius: '999px'
    }
});

export type BadgeSelectors = Selectors<'badge' | 'v__default' | 'v__neutral' | 'round' | 's__xsm' | 's__sml' | 's__med' | 's__lrg'>;

const Badge = forwardRef(({ children, cc = {}, variant = 'default', round = false, size = 'sml', color, ...props }:
    {
        cc?: BadgeSelectors;
        variant?: 'default' | 'neutral';
        round?: boolean;
        size?: FluidSize;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = combineClasses(styles, cc);

    return <div ref={ref} {...props}
        className={classes(
            style.badge,
            style[`v__${variant}`],
            style[`s__${size}`],
            round && style.round,
            props.className
        )}
        style={{ backgroundColor: color, ...props.style }}>
        {children}
    </div>;
});

Badge.displayName = 'Badge';

export default Badge;