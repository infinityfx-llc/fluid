import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, FluidStyles, Selectors } from "../../../src/types";
import { forwardRef } from "react";
import { createStyles } from "../../core/style";

export type SwatchStyles = FluidStyles<'.swatch' | '.swatch__round' | '.swatch__xsm' | '.swatch__sml' | '.swatch__med' | '.swatch__lrg'>;

const Swatch = forwardRef(({ cc = {}, size = 'med', round = false, color, ...props }:
    {
        cc?: Selectors<'swatch' | 'swatch__round' | 'swatch__xsm' | 'swatch__sml' | 'swatch__med' | 'swatch__lrg'>;
        size?: FluidSize;
        round?: boolean;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('swatch', {
        '.swatch': {
            position: 'relative',
            width: '2em',
            height: '2em',
            border: 'solid 1px var(--f-clr-fg-200)',
            borderRadius: 'var(--f-radius-sml)',
            overflow: 'hidden',
            background: 'linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%),linear-gradient(45deg, #eee 25%, #fff 25%, #fff 75%, #eee 75%, #eee 100%)',
            backgroundPosition: '0 0, 1em 1em',
            backgroundSize: '2em 2em',
            backgroundRepeat: 'repeat'
        },

        '.color': {
            content: '""',
            position: 'absolute',
            inset: 0
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
    const style = combineClasses(styles, cc);

    return <div ref={ref} {...props}
        className={classes(
            style.swatch,
            style[`swatch__${size}`],
            round && style.swatch__round,
            props.className
        )}>
        <div className={style.color} style={{ backgroundColor: color }} />
    </div>;
});

Swatch.displayName = 'Swatch';

export default Swatch;