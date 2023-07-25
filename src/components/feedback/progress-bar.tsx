'use client';

import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidSize, FluidStyles } from "@/src/types";
import { Animatable } from "@infinityfx/lively";
import { useLink } from "@infinityfx/lively/hooks";
import { forwardRef, useEffect } from "react";

export type ProgressBarStyles = FluidStyles<'.track' | '.progress' | '.track__xsm' | '.track__sml' | '.track__med' | '.track__lrg'>;

const ProgressBar = forwardRef(({ styles = {}, size = 'med', value, defaultValue = 0, color, ...props }: { styles?: ProgressBarStyles; size?: FluidSize; value?: number; defaultValue?: number; color?: string; } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue'>, ref: React.ForwardedRef<HTMLDivElement>) => {
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
            transition: 'background-color .3s',
            borderRadius: '999px'
        },

        '.track__xsm': {
            fontSize: 'var(--f-font-size-xxs)'
        },

        '.track__sml': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.track__med': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.track__lrg': {
            fontSize: 'var(--f-font-size-med)'
        }
    });

    const state = value !== undefined ? value : defaultValue;
    const [link, setLink] = useLink(state);

    useEffect(() => setLink(state, .3), [state]);

    return <div ref={ref} {...props} role="progressbar" aria-valuenow={state * 100} className={classes(
        style.track,
        style[`track__${size}`],
        props.className
    )}>
        <Animatable animate={{ scale: link(val => `${val} 1`) }} initial={{ scale: `${link()} 1` }} deform={false}>
            <div className={style.progress} style={{ backgroundColor: color }} />
        </Animatable>
    </div>;
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;