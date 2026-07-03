'use client';

import { FluidInputvalue, FluidSize, Selectors } from "../../../src/types";
import { useRef, useState } from "react";
import useInputProps from "../../../src/hooks/use-input-props";
import { Animate } from "@infinityfx/lively";
import { classes, combineClasses } from "../../../src/core/utils";
import { createStyles } from "../../core/style";
import Interactable from "../feedback/interactable";

function inputValueToInteger({ value, checked, defaultValue, defaultChecked }: {
    value?: FluidInputvalue;
    checked?: boolean;
    defaultValue?: FluidInputvalue;
    defaultChecked?: boolean;
}) {
    const raw = [value, checked, defaultValue, defaultChecked].find(value => value !== undefined);
    if (typeof raw === 'number') return raw;
    if (typeof raw === 'boolean') return +raw;

    const num = parseInt('' + raw);

    return isNaN(num) ? 0 : num;
}

const styles = createStyles('toggle', {
    '.input': {
        position: 'absolute',
        opacity: 0,
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        WebkitTapHighlightColor: 'transparent'
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
        borderRadius: 'calc(1.4em + 1px)'
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

    '.toggle:active .container': {
        translate: '0px 1px'
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
    children: React.ReactNode | React.ReactNode[];
    ref?: React.Ref<HTMLDivElement>;
    cc?: ToggleSelectors;
    size?: FluidSize;
    compact?: boolean;
    round?: boolean;
    variant?: 'default' | 'minimal' | 'neutral';
    transition?: 'slide' | 'morph';
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'size' | 'type'>;

/**
 * A button which cycles between 2 or more states.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/toggle}
 */
export default function Toggle({ children, cc = {}, size = 'med', compact = false, round = false, variant = 'default', transition = 'slide', ...props }: ToggleProps) {
    const style = combineClasses(styles, cc);

    const inputRef = useRef<HTMLInputElement>(null);
    const [split, rest] = useInputProps(props);
    const integer = inputValueToInteger(split);

    const [selected, setSelected] = split.value !== undefined || split.checked !== undefined ?
        [integer] :
        useState(integer);
    const options = Array.isArray(children) ? children : [children];
    const checked = options.length < 3 && selected !== 0;

    return <Interactable
        {...rest}
        as="div"
        interactTarget={inputRef}
        disabled={props.disabled}
        highlightColor={variant === 'minimal' && !checked ? 'var(--f-clr-primary-400)' : (variant === 'neutral' ? 'var(--f-clr-grey-300)' : undefined)}
        className={classes(
            style.toggle,
            round && style.round,
            compact && style.compact,
            style[`s__${size}`],
            style[`v__${variant}`],
            props.className
        )}
        data-checked={checked}
        data-disabled={!!props.disabled}
        data-fb={variant === 'neutral' ? 'true' : undefined}>
        <input
            {...split}
            ref={inputRef}
            type="checkbox"
            value={selected}
            checked={!!selected}
            className={style.input}
            onChange={e => {
                const updated = (selected + 1) % Math.max(options.length, 2);

                Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set?.call(inputRef.current, '' + updated);
                setSelected?.(updated);
                split.onChange?.(e);
            }} />

        <div className={style.container}>
            {options.map((content, i) => {
                const active = selected === i || options.length < 2;
                const slide = transition === 'slide';

                return <Animate
                    key={i}
                    correction="none"
                    animate={{
                        translate: active || !slide ? '0 0' : `0 ${(i - selected) * 100}%`,
                        filter: ['blur(0px)', 'blur(6px)', 'blur(0px)'],
                        opacity: active || slide ? 1 : 0,
                        scale: active || slide ? 1 : .95,
                        duration: .4
                    }}
                    triggers={{
                        animate: slide ? [] : [selected]
                    }}>
                    <div className={style.content}>{content}</div>
                </Animate>;
            })}
        </div>
    </Interactable>;
}