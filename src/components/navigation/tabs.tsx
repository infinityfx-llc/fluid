'use client';

import { FluidInputvalue, FluidStyles } from "@/src/types";
import { forwardRef, useId, useState } from "react";
import { Halo } from "../feedback";
import useStyles from "@/src/hooks/use-styles";
import { Morph } from "@infinityfx/lively/layout";
import { classes } from "@/src/core/utils";
import { Scrollarea } from "../layout";

const Tabs = forwardRef(({ options, styles = {}, variant = 'default', value, defaultValue, onChange, ...props }:
    {
        options: {
            label: string;
            value: FluidInputvalue;
            disabled?: boolean;
            panelId?: string;
        }[];
        styles?: FluidStyles;
        variant?: 'default' | 'minimal';
        value?: FluidInputvalue;
        defaultValue?: FluidInputvalue;
        onChange?: (value: FluidInputvalue) => void;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.wrapper[data-variant="default"]': {
            backgroundColor: 'var(--f-clr-fg-100)',
            borderRadius: 'var(--f-radius-sml)'
        },
        
        '.tabs': {
            display: 'flex',
            width: 'max-content'
        },

        '.wrapper[data-variant="default"] .tabs': {
            gap: 'var(--f-spacing-sml)',
            padding: '0 .6em'
        },

        '.option': {
            position: 'relative'
        },

        '.wrapper[data-variant="default"] .option': {
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

        '.wrapper[data-variant="minimal"] .button': {
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

    return <div ref={ref} {...props} className={classes(style.wrapper, props.className)} data-variant={variant}>
        <Scrollarea horizontal>
            <div className={style.tabs} role="tablist">
                {options.map(({ label, value, disabled, panelId }, i) => {

                    return <div key={i} className={style.option}>
                        <Halo disabled={disabled} color={variant === 'default' ? 'var(--f-clr-primary-200)' : undefined}>
                            <button role={panelId ? 'tab' : 'none'} aria-selected={state === value} aria-controls={panelId} className={style.button} disabled={disabled} onClick={() => {
                                setState?.(value);
                                onChange?.(value);
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
});

Tabs.displayName = 'Tabs';

export default Tabs;