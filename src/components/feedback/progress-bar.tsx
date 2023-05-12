import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidSize, FluidStyles } from "@/src/types";
import { Animatable } from "@infinityfx/lively";
import { useLink } from "@infinityfx/lively/hooks";
import { forwardRef, useEffect } from "react";

const ProgressBar = forwardRef(({ styles = {}, size = 'med', value, defaultValue, color, ...props }: { styles?: FluidStyles; size?: FluidSize; value?: number; defaultValue?: number; color?: string; } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.track': {
            height: '.4em',
            width: 'clamp(0px, 12em, 100vw)',
            borderRadius: '999px',
            overflow: 'hidden',
            backgroundColor: 'var(--f-clr-fg-100)'
        },

        '.progress': {
            height: '100%',
            backgroundColor: 'var(--f-clr-primary-100)',
            transformOrigin: 'left',
            transition: 'background-color .3s'
        },

        '.track[data-size="sml"]': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.track[data-size="med"]': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.track[data-size="lrg"]': {
            fontSize: 'var(--f-font-size-med)'
        }
    });

    const [link, setLink] = useLink((value !== undefined ? value : defaultValue) || 0);

    useEffect(() => {
        if (value !== undefined) setLink(value, .3);
    }, [value]);

    return <div ref={ref} {...props} className={classes(style.track, props.className)} data-size={size}>
        <Animatable animate={{ scale: link(val => `${val} 1`) }} initial={{ scale: `${link()} 1` }}>
            <div className={style.progress} style={{ backgroundColor: color }} />
        </Animatable>
    </div>;
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;