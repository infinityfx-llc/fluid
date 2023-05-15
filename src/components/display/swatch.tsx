import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidSize, FluidStyles } from "@/src/types";
import { forwardRef } from "react";

const Swatch = forwardRef(({ styles = {}, size = 'med', round = false, color, ...props }: { styles?: FluidStyles; size?: FluidSize; round?: boolean; } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.swatch': {
            position: 'relative',
            width: '2em',
            height: '2em',
            border: 'solid 1px var(--f-clr-grey-200)',
            borderRadius: 'var(--f-radius-sml)',
            overflow: 'hidden'
        },

        '.swatch::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%),linear-gradient(45deg, #eee 25%, #fff 25%, #fff 75%, #eee 75%, #eee 100%)',
            backgroundPosition: '0 0, 1rem 1rem',
            backgroundSize: '2rem 2rem',
            backgroundRepeat: 'repeat',
            zIndex: -1
        },

        '.swatch[data-round="true"]': {
            borderRadius: '999px'
        },

        '.swatch[data-size="sml"]': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.swatch[data-size="med"]': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.swatch[data-size="lrg"]': {
            fontSize: 'var(--f-font-size-med)'
        }
    });

    return <div ref={ref} {...props} className={classes(style.swatch, props.className)} style={{ ...props.style, backgroundColor: color }} data-size={size} data-round={round} />;
});

Swatch.displayName = 'Swatch';

export default Swatch;