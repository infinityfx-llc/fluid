'use client';

import { FluidSize, Selectors } from "../../../src/types";
import { useState } from "react";
import Halo from "../feedback/halo";
import useInputProps from "../../../src/hooks/use-input-props";
import { Animatable } from "@infinityfx/lively";
import { classes, combineClasses } from "../../../src/core/utils";
import { createStyles } from "../../core/style";

const styles = createStyles('toggle', {
    '.input': {
        position: 'absolute',
        opacity: 0,
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 2
    },

    '.input:enabled': {
        cursor: 'pointer'
    },

    '.toggle': {
        position: 'relative',
        display: 'block',
        backgroundColor: 'var(--f-clr-bg-200)',
        color: 'var(--f-clr-text-100)',
        borderRadius: 'var(--f-radius-sml)',
        transition: 'background-color .25s, color .25s'
    },

    '.toggle.round': {
        borderRadius: '999px'
    },

    '.s__xsm': {
        fontSize: 'var(--f-font-size-xxs)'
    },

    '.s__sml': {
        fontSize: 'var(--f-font-size-xsm)'
    },

    '.s__med': {
        fontSize: 'var(--f-font-size-sml)'
    },

    '.s__lrg': {
        fontSize: 'var(--f-font-size-med)'
    },

    '.v__minimal': {
        backgroundColor: 'transparent'
    },

    '.v__neutral': {
        backgroundColor: 'var(--f-clr-bg-200)',
        border: 'solid 1px var(--f-clr-fg-200)'
    },

    '.content': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--f-spacing-xsm)',
        gridArea: '1 / 1 / 1 / 1',
        lineHeight: 1,
        padding: '.8em'
    },

    '.container': {
        display: 'grid',
        overflow: 'hidden',
        height: '100%',
    },

    '.toggle.compact .content': {
        padding: '.6em'
    },

    '.toggle[data-checked="true"]:not(.v__neutral)': {
        backgroundColor: 'var(--f-clr-primary-100)',
        color: 'var(--f-clr-text-200)'
    },

    '.v__neutral[data-checked="true"]': {
        backgroundColor: 'var(--f-clr-fg-100)'
    },

    '.v__minimal[data-checked="true"]': {
        backgroundColor: 'var(--f-clr-primary-300)'
    },

    '.toggle[data-checked="false"][data-disabled="true"]': {
        color: 'var(--f-clr-grey-500)'
    },

    '.toggle[data-checked="true"][data-disabled="true"]': {
        backgroundColor: 'var(--f-clr-grey-300)',
        color: 'var(--f-clr-grey-100)'
    }
});

export type ToggleSelectors = Selectors<'toggle' | 'content' | 'container' | 's__xsm' | 's__sml' | 's__med' | 's__lrg' | 'round' | 'compact' | 'v__default' | 'v__minimal' | 'v__neutral'>;

export type ToggleProps = {
    ref?: React.Ref<HTMLDivElement>;
    cc?: ToggleSelectors;
    size?: FluidSize;
    compact?: boolean;
    round?: boolean;
    variant?: 'default' | 'minimal' | 'neutral';
    checkedContent?: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>;

/**
 * A button which toggles between an on and off state.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/toggle}
 */
export default function Toggle({ children, cc = {}, size = 'med', compact = false, round = false, variant = 'default', checkedContent, ...props }: ToggleProps) {
    const style = combineClasses(styles, cc);

    const [state, setState] = props.checked !== undefined ? [props.checked] : useState(!!props.defaultChecked);
    const [split, rest] = useInputProps(props);

    const triggers = [
        { on: state, immediate: true },
        { on: !state, reverse: true, immediate: true }
    ];

    return <Halo disabled={props.disabled} color={variant === 'minimal' && !state ? 'var(--f-clr-primary-400)' : undefined}>
        <div {...rest}
            className={classes(
                style.toggle,
                round && style.round,
                compact && style.compact,
                style[`s__${size}`],
                style[`v__${variant}`],
                props.className
            )}
            data-checked={state}
            data-disabled={!!props.disabled}>
            <input {...split} type="checkbox" className={style.input} onChange={e => {
                setState?.(e.target.checked);
                split.onChange?.(e);
            }} />

            <div className={style.container}>
                {checkedContent ? <Animatable
                    animate={{ translate: ['0 0', '0 -100%'], duration: .4 }}
                    initial={{ translate: state ? '0 -100%' : '0 0' }}
                    triggers={triggers}>
                    <div className={style.content}>{children}</div>
                </Animatable> : <div className={style.content}>{children}</div>}

                {checkedContent ? <Animatable
                    animate={{ translate: ['0 100%', '0 0'], duration: .4 }}
                    initial={{ translate: state ? '0 0' : '0 100%' }}
                    triggers={triggers}>
                    <div className={style.content}>{checkedContent}</div>
                </Animatable> : null}
            </div>
        </div>
    </Halo>;
}