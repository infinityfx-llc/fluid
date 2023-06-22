'use client';

import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidSize, FluidStyles } from "@/src/types";
import { Animatable } from "@infinityfx/lively";
import { useLink } from "@infinityfx/lively/hooks";
import { forwardRef, useEffect } from "react";

const CircularProgress = forwardRef(({ styles = {}, size = 'med', slice = 0, value, defaultValue = 0, color, ...props }: { styles?: FluidStyles; size?: FluidSize; slice?: number; value?: number; defaultValue?: number; color?: string; } & Omit<React.HTMLAttributes<SVGSVGElement>, 'children' | 'defaultValue'>, ref: React.ForwardedRef<SVGSVGElement>) => {
    const style = useStyles(styles, {
        '.wrapper': {
            width: '3.2em'
        },

        '.track': {
            stroke: 'var(--f-clr-fg-100)',
            strokeWidth: '10px',
            strokeLinecap: 'round',
            strokeDasharray: 1
        },

        '.progress': {
            stroke: 'var(--f-clr-primary-100)',
            strokeWidth: '10px',
            strokeLinecap: 'round',
            transition: 'background-color .3s'
        },

        '.wrapper[data-size="sml"]': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.wrapper[data-size="med"]': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.wrapper[data-size="lrg"]': {
            fontSize: 'var(--f-font-size-med)'
        }
    });

    const state = value !== undefined ? value : defaultValue;
    const [link, setLink] = useLink(state);

    useEffect(() => setLink(state, .3), [state]);

    return <svg ref={ref} {...props} viewBox="0 0 100 100" role="progressbar" aria-valuenow={state * 100} className={classes(style.wrapper, props.className)} style={{ ...props.style, rotate: `${90 + 180 * slice}deg` }} data-size={size}>
        <circle r={45} cx={50} cy={50} fill="none" className={style.track} pathLength={1} style={{ strokeDashoffset: slice }} />

        <Animatable animate={{ strokeLength: link(val => val * (1 - slice)) }} initial={{ strokeDashoffset: 1 - (link() * (1 - slice)) }}>
            <circle r={45} cx={50} cy={50} fill="none" className={style.progress} style={{ stroke: color }} />
        </Animatable>
    </svg>;
});

CircularProgress.displayName = 'CircularProgress';

export default CircularProgress;