import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { forwardRef } from "react";

const Skeleton = forwardRef(({ styles = {}, w, h, round = false, ...props }: { styles?: FluidStyles; w?: number; h?: number; round?: boolean; } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: any) => {
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
            borderRadius: 'var(--f-radius-sml)',
            background: 'linear-gradient(135deg, var(--f-clr-grey-200) 25%, var(--f-clr-grey-100) 50%, var(--f-clr-grey-200) 75%)',
            backgroundSize: '400% 400%',
            animation: 'skeleton-loading 2.5s linear infinite'
        },

        '.skeleton[data-round="true"]': {
            borderRadius: '999px'
        }
    });

    return <div ref={ref} {...props} className={classes(style.skeleton, props.className)} style={{ width: w, height: h }} data-round={round} />
});

Skeleton.displayName = 'Skeleton';

export default Skeleton;