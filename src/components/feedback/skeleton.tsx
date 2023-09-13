import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, FluidStyles, Selectors } from "../../../src/types";
import { forwardRef } from "react";
import { createStyles } from "../../core/style";

export type SkeletonStyles = FluidStyles<'.skeleton' | '.skeleton__rad__xsm' | '.skeleton__rad__sml' | '.skeleton__rad__med' | '.skeleton__rad__lrg' | '.skeleton__rad__max'>;

const Skeleton = forwardRef(({ cc = {}, w, h, radius = 'sml', ...props }:
    {
        cc?: Selectors<'skeleton' | 'skeleton__rad__xsm' | 'skeleton__rad__sml' | 'skeleton__rad__med' | 'skeleton__rad__lrg' | 'skeleton__rad__max'>;
        w?: number;
        h?: number;
        radius?: FluidSize | 'max';
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: any) => {
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
        },

        '.skeleton__rad__xsm': {
            borderRadius: 'var(--f-radius-xsm)'
        },

        '.skeleton__rad__sml': {
            borderRadius: 'var(--f-radius-sml)'
        },

        '.skeleton__rad__med': {
            borderRadius: 'var(--f-radius-med)'
        },

        '.skeleton__rad__lrg': {
            borderRadius: 'var(--f-radius-lrg)'
        },

        '.skeleton__rad__max': {
            borderRadius: '999px'
        }
    });
    const style = combineClasses(styles, cc);

    return <div ref={ref} {...props} className={classes(
        style.skeleton,
        style[`skeleton__rad__${radius}`],
        props.className
    )} style={{ width: w, height: h, ...props.style }} />
});

Skeleton.displayName = 'Skeleton';

export default Skeleton;