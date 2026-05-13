'use client';

import { FluidInputvalue, Selectors } from "../../../src/types";
import { useId, useRef, useState } from "react";
import { Animate } from "@infinityfx/lively";
import { classes, combineClasses } from "../../../src/core/utils";
import Scrollarea from "../layout/scrollarea";
import { createStyles } from "../../core/style";
import Interactable from "../feedback/interactable";

const styles = createStyles('tabs', {
    '.v__default': {
        backgroundColor: 'var(--f-clr-fg-100)',
        borderRadius: 'var(--f-radius-sml)'
    },

    '.tabs': {
        display: 'flex',
        width: 'max-content'
    },

    '.v__default .tabs': {
        gap: 'var(--f-spacing-sml)',
        padding: '0 .6em'
    },

    '.option': {
        position: 'relative'
    },

    '.v__default .option': {
        padding: '.6em 0'
    },

    '.selection': {
        position: 'absolute',
        width: '100%',
        height: '3px',
        backgroundColor: 'var(--f-clr-text-100)',
        left: 0,
        bottom: 0,
        borderRadius: '99px'
    },

    '.button': {
        position: 'relative',
        padding: '.4em .6em',
        borderRadius: 'var(--f-radius-sml)',
        color: 'var(--f-clr-text-100)',
        fontSize: 'var(--f-font-size-sml)',
        fontWeight: 600
    },

    '.v__minimal .button': {
        padding: '.8em 1.2em'
    },

    '.button:enabled': {
        cursor: 'pointer'
    },

    '.button:disabled': {
        color: 'var(--f-clr-grey-500)'
    }
});

export type TabsSelectors = Selectors<'wrapper' | 'tabs' | 'option' | 'selection' | 'button' | 'v__default' | 'v__minimal'>;

type TabsProps<T> = {
    ref?: React.Ref<HTMLDivElement>;
    cc?: TabsSelectors;
    options: {
        label: string;
        value: FluidInputvalue;
        disabled?: boolean;
        panelId?: string;
    }[];
    variant?: 'default' | 'minimal';
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'>;

/**
 * An input with multiple options of which only 1 can be selected at a time.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/tabs}
 */
export default function Tabs<T extends FluidInputvalue>({ options, cc = {}, variant = 'default', value, defaultValue, onChange, ...props }: TabsProps<T>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const tabs = useRef<(HTMLButtonElement | null)[]>([]);
    const [state, setState] = value !== undefined ? [value] : useState<FluidInputvalue>(defaultValue || options[0]?.value);

    function focus(index: number) {
        const arr = tabs.current.filter(tab => tab);
        index = index < 0 ? arr.length - 1 : (index >= arr.length ? 0 : index);

        arr[index]?.focus();
    }

    return <div {...props} className={classes(
        style.wrapper,
        style[`v__${variant}`],
        props.className
    )}>
        <Scrollarea horizontal>
            <div className={style.tabs} role="tablist">
                {options.map(({ label, value, disabled, panelId }, i) => {

                    return <div key={i} className={style.option}>
                        <Interactable
                            role="tab"
                            disabled={disabled}
                            highlightColor={variant === 'default' ? 'var(--f-clr-primary-300)' : 'var(--f-clr-primary-400)'}
                            ref={el => {
                                tabs.current[i] = disabled ? null : el;
                            }}
                            className={style.button}
                            aria-selected={state === value}
                            aria-controls={panelId}
                            onClick={() => {
                                setState?.(value);
                                onChange?.(value as T);
                            }}
                            onKeyDown={e => {
                                let matched = true;

                                switch (e.key) {
                                    case 'ArrowRight':
                                    case 'ArrowDown':
                                        focus(i + 1);
                                        break;
                                    case 'ArrowLeft':
                                    case 'ArrowUp':
                                        focus(i - 1);
                                        break;
                                    case 'Home':
                                        focus(0);
                                        break;
                                    case 'End':
                                        focus(-1);
                                        break;
                                    default:
                                        matched = false;
                                }

                                if (matched) e.preventDefault();
                            }}>
                            {label}
                        </Interactable>

                        {state === value && <Animate
                            morph={`tabs-selection-${id}`}
                            transition={{
                                cache: ['x', 'sx']
                            }}>
                            <div className={style.selection} />
                        </Animate>}
                    </div>;
                })}
            </div>
        </Scrollarea>
    </div>;
}