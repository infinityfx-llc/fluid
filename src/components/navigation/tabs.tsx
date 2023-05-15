import { FluidInputvalue, FluidStyles } from "@/src/types";
import { forwardRef, useId, useState } from "react";
import { Halo } from "../feedback";
import useStyles from "@/src/hooks/use-styles";
import { Morph } from "@infinityfx/lively/layout";
import { classes } from "@/src/core/utils";

const Tabs = forwardRef(({ options, styles = {}, value, defaultValue, onChange, ...props }:
    {
        options: {
            label: string;
            value: FluidInputvalue;
            disabled?: boolean;
        }[];
        styles?: FluidStyles;
        value?: FluidInputvalue;
        defaultValue?: FluidInputvalue;
        onChange?: (value: FluidInputvalue) => void;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.tabs': {
            display: 'flex',
            gap: 'var(--f-spacing-sml)',
            padding: '0 .6em',
            backgroundColor: 'var(--f-clr-fg-100)',
            borderRadius: 'var(--f-radius-sml)'
        },

        '.option': {
            position: 'relative',
            padding: '.6em 0'
        },

        '.selection': {
            position: 'absolute',
            width: '100%',
            height: '3px',
            backgroundColor: 'var(--f-clr-text-100)',
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

        '.button:enabled': {
            cursor: 'pointer'
        },

        '.button:disabled': {
            color: 'var(--f-clr-grey-500)'
        }
    });

    const id = useId();
    const [state, setState] = value !== undefined ? [value] : useState<FluidInputvalue>(defaultValue || options[0]?.value);

    return <div ref={ref} {...props} className={classes(style.tabs, props.className)}>
        {options.map(({ label, value, disabled }, i) => {
            return <div key={i} className={style.option}>
                <Halo disabled={disabled} color="var(--f-clr-primary-200)">
                    <button className={style.button} disabled={disabled} onClick={() => {
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
    </div>;
});

Tabs.displayName = 'Tabs';

export default Tabs;