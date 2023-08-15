import { classes } from "../../../src/core/utils";
import useStyles from "../../../src/hooks/use-styles";
import { FluidSize, FluidStyles } from "../../../src/types";
import { forwardRef } from "react";

export type SkeletonStyles = FluidStyles<'.skeleton' | '.skeleton__rad__xsm' | '.skeleton__rad__sml' | '.skeleton__rad__med' | '.skeleton__rad__lrg' | '.skeleton__rad__max'>;

const Skeleton = forwardRef(({ styles = {}, w, h, radius = 'sml', ...props }: { styles?: SkeletonStyles; w?: number; h?: number; radius?: FluidSize | 'max'; } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: any) => {
    const style = useStyles(styles, {
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

    return <div ref={ref} {...props} className={classes(
        style.skeleton,
        style[`skeleton__rad__${radius}`],
        props.className
    )} style={{ width: w, height: h, ...props.style }} />
});

Skeleton.displayName = 'Skeleton';

export default Skeleton;