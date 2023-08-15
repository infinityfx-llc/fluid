'use client';

import { FluidInputvalue, FluidStyles } from "../../../src/types";
import { forwardRef, useId, useState } from "react";
import Halo from "../feedback/halo";
import useStyles from "../../../src/hooks/use-styles";
import { Morph } from "@infinityfx/lively/layout";
import { classes } from "../../../src/core/utils";
import Scrollarea from "../layout/scrollarea";

export type TabsStyles = FluidStyles<'.wrapper' | '.tabs' | '.option' | '.selection' | '.button' | '.wrapper__var__default' | '.wrapper__var__minimal'>;

type TabsProps<T> = {
    options: {
        label: string;
        value: FluidInputvalue;
        disabled?: boolean;
        panelId?: string;
    }[];
    styles?: TabsStyles;
    variant?: 'default' | 'minimal';
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'>;

function TabsComponent<T extends FluidInputvalue>({ options, styles = {}, variant = 'default', value, defaultValue, onChange, ...props }: TabsProps<T>, ref: React.ForwardedRef<HTMLDivElement>) {
    const style = useStyles(styles, {
        '.wrapper__var__default': {
            backgroundColor: 'var(--f-clr-fg-100)',
            borderRadius: 'var(--f-radius-sml)'
        },

        '.tabs': {
            display: 'flex',
            width: 'max-content'
        },

        '.wrapper__var__default .tabs': {
            gap: 'var(--f-spacing-sml)',
            padding: '0 .6em'
        },

        '.option': {
            position: 'relative'
        },

        '.wrapper__var__default .option': {
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
            outline: 'none',
            border: 'none',
            background: 'none',
            padding: '.4em .6em',
            borderRadius: 'var(--f-radius-sml)',
            color: 'var(--f-clr-text-100)',
            fontSize: 'var(--f-font-size-sml)',
            fontWeight: 600
        },

        '.wrapper__var__minimal .button': {
            padding: '.8em 1.2em'
        },

        '.button:enabled': {
            cursor: 'pointer'
        },

        '.button:disabled': {
            color: 'var(--f-clr-grey-500)'
        }
    });

    const id = useId();
    const [state, setState] = value !== undefined ? [value] : useState<FluidInputvalue>(defaultValue || options[0]?.value);

    return <div ref={ref} {...props} className={classes(
        style.wrapper,
        style[`wrapper__var__${variant}`],
        props.className
    )}>
        <Scrollarea horizontal>
            <div className={style.tabs} role="tablist">
                {options.map(({ label, value, disabled, panelId }, i) => {

                    return <div key={i} className={style.option}>
                        <Halo disabled={disabled} color={variant === 'default' ? 'var(--f-clr-primary-200)' : undefined}>
                            <button role={panelId ? 'tab' : 'none'} aria-selected={state === value} aria-controls={panelId} className={style.button} disabled={disabled} onClick={() => {
                                setState?.(value);
                                onChange?.(value as T);
                            }}>
                                {label}
                            </button>
                        </Halo>

                        <Morph id={`tabs-selection-${id}`} shown={state === value} deform={false}>
                            <div className={style.selection} />
                        </Morph>
                    </div>;
                })}
            </div>
        </Scrollarea>
    </div>;
}

const Tabs = forwardRef(TabsComponent) as (<T extends FluidInputvalue>(props: TabsProps<T> & { ref?: React.ForwardedRef<HTMLDivElement>; }) => ReturnType<typeof TabsComponent>) & { displayName: string; };

Tabs.displayName = 'Tabs';

export default Tabs;