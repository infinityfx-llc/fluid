'use client';

import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, Selectors } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { useLink } from "@infinityfx/lively/hooks";
import { useEffect } from "react";
import { createStyles } from "../../core/style";

const styles = createStyles('progress-bar', {
    '.track': {
        height: '.4em',
        minWidth: 'min(100vw, 12em)',
        borderRadius: '999px',
        overflow: 'hidden',
        backgroundColor: 'var(--f-clr-fg-100)'
    },

    '.progress': {
        height: '100%',
        backgroundColor: 'var(--color, var(--f-clr-primary-100))',
        transformOrigin: 'left',
        transition: 'background-color .3s',
        borderRadius: '999px'
    },

    '.s__xsm': {
        fontSize: 'var(--f-font-size-xsm)'
    },

    '.s__sml': {
        fontSize: 'var(--f-font-size-sml)'
    },

    '.s__med': {
        fontSize: 'var(--f-font-size-med)'
    },

    '.s__lrg': {
        fontSize: 'var(--f-font-size-lrg)'
    }
});

export type ProgressBarSelectors = Selectors<'track' | 'progress' | 's__xsm' | 's__sml' | 's__med' | 's__lrg'>;

// vertical variant?

/**
 * An indicator displaying the progress of something.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/progress-bar}
 */
export default function ProgressBar({ cc = {}, size = 'med', value = 0, color, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: ProgressBarSelectors;
        size?: FluidSize;
        value?: number;
        color?: string;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const style = combineClasses(styles, cc);
    const link = useLink(value);

    useEffect(() => link.set(value, { duration: .3 }), [value]);

    return <div {...props} role="progressbar" aria-valuenow={value * 100} className={classes(
        style.track,
        style[`s__${size}`],
        props.className
    )}>
        <Animatable animate={{ scale: link(val => `${val} 1`) }} initial={{ scale: `${link()} 1` }} deform={false}>
            <div className={style.progress} style={{ '--color': color } as any} />
        </Animatable>
    </div>;
}