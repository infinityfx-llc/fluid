import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidSize, FluidStyles } from "@/src/types";
import { forwardRef } from "react";

export type SwatchStyles = FluidStyles<'.swatch' | '.swatch__round' | '.swatch__xsm' | '.swatch__sml' | '.swatch__med' | '.swatch__lrg'>;

const Swatch = forwardRef(({ styles = {}, size = 'med', round = false, color, ...props }: { styles?: SwatchStyles; size?: FluidSize; round?: boolean; } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.swatch': {
            position: 'relative',
            width: '2em',
            height: '2em',
            border: 'solid 1px var(--f-clr-fg-200)',
            borderRadius: 'var(--f-radius-sml)',
            overflow: 'hidden'
        },

        '.swatch::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%),linear-gradient(45deg, #eee 25%, #fff 25%, #fff 75%, #eee 75%, #eee 100%)',
            backgroundPosition: '0 0, 1em 1em',
            backgroundSize: '2em 2em',
            backgroundRepeat: 'repeat',
            zIndex: -1
        },

        '.swatch__round': {
            borderRadius: '999px'
        },

        '.swatch__xsm': {
            fontSize: 'var(--f-font-size-xxs)'
        },

        '.swatch__sml': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.swatch__med': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.swatch__lrg': {
            fontSize: 'var(--f-font-size-med)'
        }
    });

    return <div ref={ref} {...props} className={classes(
        style.swatch,
        style[`swatch__${size}`],
        round && style.swatch__round,
        props.className
    )} style={{ backgroundColor: color, ...props.style }} />;
});

Swatch.displayName = 'Swatch';

export default Swatch;