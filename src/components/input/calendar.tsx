'use client';

import useStyles from "@/src/hooks/use-styles";
import { FluidSize, FluidStyles } from "@/src/types";
import { forwardRef, useState } from "react";
import Button from "./button";
import { MdArrowBack, MdArrowForward, MdExpand, MdExpandMore } from "react-icons/md";
import { classes } from "@/src/core/utils";
// import { Halo } from "../feedback";
// import { Popover } from "../layout";

const Calendar = forwardRef(({ styles = {}, locale, size = 'med', round, defaultValue = new Date(), value, onChange, disabled, ...props }:
    {
        styles?: FluidStyles;
        locale?: Intl.LocalesArgument;
        size?: FluidSize;
        round?: boolean;
        value?: Date;
        defaultValue?: Date;
        onChange?: (value: Date) => void;
        disabled?: boolean | Date[];
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'children' | 'onChange'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.calendar': {
            backgroundColor: 'var(--f-clr-fg-100)',
            padding: '.6em',
            borderRadius: 'var(--f-radius-sml)'
        },

        '.calendar[data-size="sml"]': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.calendar[data-size="med"]': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.calendar[data-size="lrg"]': {
            fontSize: 'var(--f-font-size-med)'
        },

        '.calendar[data-round="true"]': {
            borderRadius: 'var(--f-radius-xlg)'
        },

        '.header': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '.6em'
        },

        '.header > *': {
            fontSize: '1em !important'
        },

        '.text': {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xsm)',
            color: 'var(--f-clr-text-100)',
            fontWeight: 700,
            fontSize: 'var(--f-font-size-xsm) !important'
        },

        '.years': {
            backgroundColor: 'var(--f-clr-bg-100)',
            border: 'solid 1px var(--f-clr-grey-100)',
            borderRadius: 'var(--f-radius-sml)',
            boxShadow: '0 0 8px rgb(0, 0, 0, .06)',
            height: '100px',
            width: '200px'
        },

        '.grid': {
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)'
        },

        '.grid > *': {
            width: '2.3em',
            height: '2.3em'
        },

        '.label': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: '.85em',
            color: 'var(--f-clr-grey-600)'
        },

        '.date': {
            fontSize: '1em !important'
        },

        '.date[data-present="false"]': {
            color: 'var(--f-clr-grey-400)',
            fontWeight: 400
        },

        '.date[data-variant="minimal"]:disabled': {
            background: 'none'
        },

        '.date[data-variant="default"]:disabled': {
            backgroundColor: 'var(--f-clr-grey-200)',
            color: 'var(--f-clr-text-100)'
        }
    });

    const [date, setDate] = value !== undefined ? [value] : useState(defaultValue);

    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    const monday = new Date(first), day = first.getDay();
    monday.setDate(first.getDate() - (day || 7) + 1);

    function update(value: Date) {
        setDate?.(value);
        onChange?.(value);
    }

    function isEqual(a: Date, b: Date) {
        return a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    return <div ref={ref} {...props} className={classes(style.calendar, props.className)} data-size={size} data-round={round}>
        <div className={style.header}>
            <Button disabled={disabled === true} variant="minimal" round={round} onClick={() => {
                const updated = new Date(date);
                updated.setMonth(date.getMonth() - 1);
                update(updated);
            }}>
                <MdArrowBack />
            </Button>

            <div className={style.text}>
                {date.toLocaleString(locale, { month: 'long' })}

                {/* <Popover2.Root position="center">
                    <Popover2.Trigger> */}
                        <Button size="sml" variant="light">
                            {date.toLocaleString(locale, { year: 'numeric' })}

                            <MdExpandMore />
                        </Button>
                    {/* </Popover2.Trigger>

                    <Popover2.Content>
                        <div className={style.years}>

                        </div>
                    </Popover2.Content>
                </Popover2.Root> */}
            </div>

            <Button disabled={disabled === true} variant="minimal" round={round} onClick={() => {
                const updated = new Date(date);
                updated.setMonth(date.getMonth() + 1);
                update(updated);
            }}>
                <MdArrowForward />
            </Button>
        </div>

        <div className={style.grid}>
            {new Array(7).fill(0).map((_, i) => {
                const day = new Date(monday);
                day.setDate(monday.getDate() + i);

                return <div key={i} className={style.label}>
                    {day.toLocaleString(locale, { weekday: 'short' })}
                </div>;
            })}

            {new Array(42).fill(0).map((_, i) => {
                const day = new Date(monday);
                day.setDate(monday.getDate() + i);
                const isMonth = day.getMonth() === date.getMonth();

                const isDisabled = Array.isArray(disabled) ? disabled.some(val => isEqual(val, day)) : disabled;

                return <Button disabled={isDisabled} key={i} round={round} className={style.date} data-present={isMonth} variant={isEqual(date, day) ? 'default' : 'minimal'} onClick={() => update(day)}>
                    {day.getDate()}
                </Button>;
            })}
        </div>
    </div>;
});

Calendar.displayName = 'Calendar';

export default Calendar;

// multiple/range select
// aria (role="grid")