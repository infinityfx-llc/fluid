import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, Selectors } from "../../../src/types";
import { createStyles } from "../../core/style";

const styles = createStyles('swatch', {
    '.swatch': {
        position: 'relative',
        width: '2em',
        height: '2em',
        border: 'solid 1px var(--f-clr-fg-200)',
        borderRadius: 'var(--f-radius-sml)',
        overflow: 'hidden',
        background: 'linear-gradient(45deg, var(--f-clr-grey-100) 25%, transparent 25%, transparent 75%, var(--f-clr-grey-100) 75%, var(--f-clr-grey-100) 100%), linear-gradient(45deg, var(--f-clr-grey-100) 25%, var(--f-clr-bg-200) 25%, var(--f-clr-bg-200) 75%, var(--f-clr-grey-100) 75%, var(--f-clr-grey-100) 100%)',
        backgroundPosition: '0 0, 1em 1em',
        backgroundSize: '2em 2em',
        backgroundRepeat: 'repeat',
        display: 'flex'
    },

    '.color': {
        height: '100%',
        flexGrow: 1
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

/**
 * Displays one or multiple colors.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/swatch}
 */
export default function Swatch({ cc = {}, size = 'med', round = false, color = ['transparent'], ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: SwatchSelectors;
        size?: FluidSize;
        round?: boolean;
        color?: string | string[];
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'color'>) {
    const style = combineClasses(styles, cc);
    color = Array.isArray(color) ? color: [color];

    return <div {...props}
        className={classes(
            style.swatch,
            style[`s__${size}`],
            round && style.round,
            props.className
        )}>
        {color.map(color => <div key={color} className={style.color} style={{ backgroundColor: color }} />)}
    </div>;
}