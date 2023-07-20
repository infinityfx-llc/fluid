import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidSize, FluidStyles } from "@/src/types";
import { forwardRef } from "react";

const Skeleton = forwardRef(({ styles = {}, w, h, radius = 'sml', ...props }: { styles?: FluidStyles; w?: number; h?: number; radius?: FluidSize | 'max'; } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: any) => {
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

        '.skeleton[data-radius="xsm"]': {
            borderRadius: 'var(--f-radius-xsm)'
        },

        '.skeleton[data-radius="sml"]': {
            borderRadius: 'var(--f-radius-sml)'
        },

        '.skeleton[data-radius="med"]': {
            borderRadius: 'var(--f-radius-med)'
        },

        '.skeleton[data-radius="lrg"]': {
            borderRadius: 'var(--f-radius-lrg)'
        },

        '.skeleton[data-radius="max"]': {
            borderRadius: '999px'
        }
    });

    return <div ref={ref} {...props} className={classes(style.skeleton, props.className)} style={{ width: w, height: h, ...props.style }} data-radius={radius} />
});

Skeleton.displayName = 'Skeleton';

export default Skeleton;