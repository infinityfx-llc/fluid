import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { forwardRef } from "react";

const Frame = forwardRef(({ children, radius = 'sml', shadow, border, ...props }: { radius?: 'sml' | 'med' | 'lrg'; shadow?: boolean; border?: boolean; } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles({
        '.frame': {
            overflow: 'hidden',
            borderRadius: `var(--f-radius-${radius})`,
            boxShadow: shadow ? '0 0 8px rgb(0, 0, 0, 0.08)' : undefined,
            border: border ? 'solid 1px var(--f-clr-grey-200)' : undefined,
            color: 'var(--f-clr-text-100)'
        },

        '.frame img': {
            objectFit: 'cover',
            display: 'block'
        }
    });

    return <div ref={ref} {...props} className={classes(style.frame, props.className)}>
        {children}
    </div>;
});

Frame.displayName = 'Frame';

export default Frame;