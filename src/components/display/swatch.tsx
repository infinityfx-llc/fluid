import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, Selectors } from "../../../src/types";
import { forwardRef } from "react";
import { createStyles } from "../../core/style";

const styles = createStyles('swatch', {
    '.swatch': {
        position: 'relative',
        width: '2em',
        height: '2em',
        border: 'solid 1px var(--f-clr-fg-200)',
        borderRadius: 'var(--f-radius-sml)',
        overflow: 'hidden',
        background: 'linear-gradient(45deg, var(--f-clr-grey-100) 25%, transparent 25%, transparent 75%, var(--f-clr-grey-100) 75%, var(--f-clr-grey-100) 100%), linear-gradient(45deg, var(--f-clr-grey-100) 25%, var(--f-clr-bg-100) 25%, var(--f-clr-bg-100) 75%, var(--f-clr-grey-100) 75%, var(--f-clr-grey-100) 100%)',
        backgroundPosition: '0 0, 1em 1em',
        backgroundSize: '2em 2em',
        backgroundRepeat: 'repeat'
    },

    '.color': {
        content: '""',
        position: 'absolute',
        inset: 0
    },

    '.swatch.round': {
        borderRadius: '999px'
    },

    '.s__xsm': {
        fontSize: 'var(--f-font-size-xxs)'
    },

    '.s__sml': {
        fontSize: 'var(--f-font-size-xsm)'
    },

    '.s__med': {
        fontSize: 'var(--f-font-size-sml)'
    },

    '.s__lrg': {
        fontSize: 'var(--f-font-size-med)'
    }
});

export type SwatchSelectors = Selectors<'swatch' | 'round' | 's__xsm' | 's__sml' | 's__med' | 's__lrg'>;

const Swatch = forwardRef(({ cc = {}, size = 'med', round = false, color, ...props }:
    {
        cc?: SwatchSelectors;
        size?: FluidSize;
        round?: boolean;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = combineClasses(styles, cc);

    return <div ref={ref} {...props}
        className={classes(
            style.swatch,
            style[`s__${size}`],
            round && style.round,
            props.className
        )}>
        <div className={style.color} style={{ backgroundColor: color }} />
    </div>;
});

Swatch.displayName = 'Swatch';

export default Swatch;