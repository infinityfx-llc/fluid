'use client';

import { Selectors } from "../../../src/types";
import { forwardRef, useState } from "react";
import Halo from "../feedback/halo";
import { Animatable } from "@infinityfx/lively";
import { classes, combineClasses } from "../../../src/core/utils";
import { createStyles } from "../../core/style";

const styles = createStyles('hamburger', {
    '.hamburger': {
        position: 'relative',
        border: 'none',
        background: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '2.5em',
        width: '2.5em',
        padding: '.5em',
        borderRadius: 'var(--f-radius-sml)',
        outline: 'none'
    },

    '.line': {
        width: '100%',
        height: '3px',
        backgroundColor: 'var(--color)',
        transformOrigin: 'bottom right',
        borderRadius: '99px'
    },

    '.hamburger:enabled': {
        cursor: 'pointer'
    },

    '.hamburger:disabled .line': {
        backgroundColor: 'var(--f-clr-grey-400)'
    },

    '.cross': {
        inset: '.25em',
        position: 'absolute',
        rotate: '-45deg',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    '.cross > *:last-child': {
        position: 'absolute',
        height: '100%',
        width: '3px'
    }
});

export type HamburgerSelectors = Selectors<'hamburger' | 'line' | 'cross'>

const Hamburger = forwardRef(({ cc = {}, open, color = 'var(--f-clr-text-100)', ...props }: {
    cc?: HamburgerSelectors;
    open?: boolean;
    color?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const style = combineClasses(styles, cc);

    const [state, setState] = open !== undefined ? [open] : useState(false);

    return <Halo disabled={props.disabled}>
        <button ref={ref} {...props}
            style={{
                ...props.style,
                '--color': color
            } as any}
            className={classes(
                style.hamburger,
                props.className
            )}
            onClick={e => {
                setState?.(!state);
                props.onClick?.(e);
            }}>
            <Animatable animate={{ scale: ['1 1', '0 1', '0 1'], duration: .6 }} deform={false} triggers={[
                { on: state, immediate: true },
                { on: !state, reverse: true, immediate: true }
            ]}>
                {new Array(3).fill(0).map((_, i) => {
                    return <div key={i} className={style.line} />
                })}
            </Animatable>

            <div className={style.cross}>
                <Animatable animate={{ scale: ['0 1', '0 1', '1 1'], duration: .6 }} deform={false} triggers={[
                    { on: state, immediate: true },
                    { on: !state, reverse: true, immediate: true }
                ]}>
                    <div className={style.line} />
                </Animatable>
                <Animatable animate={{ scale: ['1 0', '1 0', '1 1'], duration: .6, delay: .2 }} deform={false} triggers={[
                    { on: state, immediate: true },
                    { on: !state, reverse: true, immediate: true }
                ]}>
                    <div className={style.line} />
                </Animatable>
            </div>
        </button>
    </Halo>;
});

Hamburger.displayName = 'Hamburger';

export default Hamburger;