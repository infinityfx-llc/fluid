import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, Selectors } from "../../../src/types";
import { createStyles } from "../../core/style";

const styles = createStyles('skeleton', {
    '@keyframes skeleton-loading': {
        '0%': {
            backgroundPosition: '100% 100%'
        },
        '100%': {
            backgroundPosition: '0% 0%'
        }
    },

    '.skeleton': {
        background: 'linear-gradient(135deg, var(--f-clr-grey-200) 25%, var(--f-clr-grey-100) 50%, var(--f-clr-grey-200) 75%)',
        backgroundSize: '400% 400%',
        animation: 'skeleton-loading 2.5s linear infinite'
    }
});

export type SkeletonSelectors = Selectors<'skeleton'>;

/**
 * Used to show a placeholder while content is loading.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/skeleton}
 */
export default function Skeleton({ cc = {}, w, h, ar, radius = 'sml', ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: SkeletonSelectors;
        w?: number | string;
        h?: number | string;
        ar?: number;
        radius?: FluidSize | 'max';
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const style = combineClasses(styles, cc);

    return <div {...props}
        className={classes(
            style.skeleton,
            props.className
        )}
        style={{
            width: w,
            height: h,
            borderRadius: radius !== 'max' ? `var(--f-radius-${radius})` : '999px',
            aspectRatio: ar,
            ...props.style
        }} />
}