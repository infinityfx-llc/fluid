import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { forwardRef } from "react";

const Key = forwardRef(({ children, styles = {}, ...props }: { children: string; styles?: FluidStyles; } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.key': {
            position: 'relative',
            fontWeight: 700,
            fontSize: 'var(--f-font-size-xsm)',
            color: 'var(--f-clr-grey-600)',
            backgroundColor: 'var(--f-clr-grey-300)',
            borderRadius: 'var(--f-radius-sml)',
            padding: '.2em .5em .4em .5em',
            zIndex: 0
        },

        '.key::after': {
            content: '""',
            position: 'absolute',
            backgroundColor: 'var(--f-clr-grey-200)',
            borderRadius: 'calc(var(--f-radius-sml) - 1px)',
            inset: '2px 2px calc(2px + .2em) 2px',
            zIndex: -1
        }
    });

    return <div ref={ref} {...props} className={classes(style.key, props.className)}>
        {children}
    </div>;
});

Key.displayName = 'Key';

export default Key;