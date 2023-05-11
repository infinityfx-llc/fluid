import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { forwardRef } from "react";

const Badge = forwardRef(({ children, styles = {}, round = false, color, ...props }: { children: string; styles?: FluidStyles; round?: boolean; } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.badge': {
            fontSize: 'var(--f-font-size-xxs)',
            fontWeight: 800,
            color: 'var(--f-clr-text-100)',
            textTransform: 'uppercase',
            backgroundColor: 'var(--f-clr-primary-400)',
            borderRadius: 'var(--f-radius-sml)',
            padding: '.2em .6em'
        },

        '.badge[data-round="true"]': {
            borderRadius: '999px'
        }
    });

    return <div ref={ref} {...props} className={classes(style.badge, props.className)} style={{ backgroundColor: color }} data-round={round}>
        {children}
    </div>;
});

Badge.displayName = 'Badge';

export default Badge;