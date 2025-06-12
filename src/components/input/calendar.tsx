'use client';

import { FluidSize, Selectors } from "../../../src/types";
import { useRef, useState } from "react";
import Button from "./button";
import { classes, combineClasses } from "../../../src/core/utils";
import { createStyles } from "../../core/style";
import { Icon } from "../../core/icons";
import Halo from "../feedback/halo";
import { Animatable } from "@infinityfx/lively";
import { useTrigger } from "@infinityfx/lively/hooks";
import Toggle from "./toggle";

// multiple/range select
// disable from/to certain date

function isEqual(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

function offsetDate(date: Date, days: number) {
    const offset = new Date(date);
    offset.setDate(date.getDate() + days);

    return offset;
}

const styles = createStyles('calendar', {
    '.calendar': {
        backgroundColor: 'var(--f-clr-fg-100)',
        padding: '.6em',
        borderRadius: 'var(--f-radius-med)'
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

    '.calendar.round': {
        borderRadius: 'var(--f-radius-xlg)'
    },

    '.header': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '.6em'
    },

    '.toggle': {
        fontWeight: 600
    },

    '.years': {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        rowGap: 'var(--f-spacing-xxs)',
        width: '15.4em',
        height: '15.7125em'
    },

    '.grid': {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--f-spacing-xxs)'
    },

    '.row': {
        display: 'flex',
        justifyContent: 'space-around'
    },

    '.label': {
        display: 'flex',
        flexBasis: 0,
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: '.85em',
        color: 'var(--f-clr-grey-600)',
        marginBottom: 'var(--f-spacing-xxs)'
    },

    '.date': {
        position: 'relative',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontSize: '1em',
        borderRadius: 'var(--f-radius-sml)',
        color: 'var(--f-clr-grey-300)',
        transition: 'background-color .25s, color .25s',
        WebkitTapHighlightColor: 'transparent'
    },

    '.grid .date': {
        height: '2.2em',
        width: '2.2em'
    },

    '.round .date': {
        borderRadius: '99px'
    },

    '.date:enabled': {
        cursor: 'pointer'
    },

    '.date:disabled': {
        color: 'var(--f-clr-grey-500)'
    },

    '.date.unavailable': {
        textDecoration: 'line-through'
    },

    '.date.bold': {
        fontWeight: 500
    },

    '.date.bold:enabled': {
        color: 'var(--f-clr-text-100)'
    },

    '.date.today:enabled': {
        backgroundColor: 'var(--f-clr-fg-200)'
    },

    '.date.selected:enabled': {
        backgroundColor: 'var(--f-clr-primary-100)',
        color: 'var(--f-clr-text-200)'
    },

    '.date.selected:disabled': {
        backgroundColor: 'var(--f-clr-grey-100)',
        color: 'var(--f-clr-grey-500)'
    }
});

export type CalendarSelectors = Selectors<'calendar' | 'header' | 'text' | 'years' | 'round' | 's__xsm' | 's__sml' | 's__med' | 's__lrg'>;

/**
 * An input used for selecting a date.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/calendar}
 */
export default function Calendar({ cc = {}, locale, size = 'med', round, defaultValue, value, onChange, disabled = false, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: CalendarSelectors;
        locale?: Intl.LocalesArgument;
        size?: FluidSize;
        round?: boolean;
        value?: Date | null;
        defaultValue?: Date;
        onChange?: (value: Date) => void;
        disabled?: boolean | Date[];
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'children' | 'onChange'>) {
    const style = combineClasses(styles, cc);

    const trigger = useTrigger();
    const dates = useRef<(HTMLButtonElement | null)[]>([]);
    const [years, setYears] = useState(false);

    const [dateState, setDate] = value !== undefined ? [value, onChange] : useState(defaultValue);
    const date = dateState || new Date();

    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstMonday = offsetDate(firstOfMonth, -(firstOfMonth.getDay() || 7) + 1);
    const nextMonth = new Date(date);
    nextMonth.setMonth(date.getMonth() + 1);
    const prevMonth = new Date(date);
    prevMonth.setMonth(date.getMonth() - 1);

    try {
        // make sure locale is valid
        new Intl.Locale(locale as any);
    } catch (ex) {
        locale = 'en';
    }

    const buttonProps = {
        ...cc,
        size,
        round,
        compact: true,
        disabled: disabled === true,
        variant: 'minimal' as const
    };

    return <div {...props} className={classes(
        style.calendar,
        round && style.round,
        style[`s__${size}`],
        props.className
    )}>
        <div className={style.header}>
            <Button
                {...buttonProps}
                aria-label={prevMonth.toLocaleString(locale, { month: 'long' })}
                onClick={() => {
                    setDate?.(prevMonth);
                    trigger();
                }}>
                <Icon type="left" />
            </Button>

            <Toggle
                {...buttonProps}
                checked={years}
                onChange={e => {
                    setYears(e.target.checked);
                    trigger();
                }}
                className={style.toggle}>
                {date.toLocaleString(locale, { month: 'short', year: 'numeric' })}
            </Toggle>

            <Button
                {...buttonProps}
                aria-label={nextMonth.toLocaleString(locale, { month: 'long' })}
                onClick={() => {
                    setDate?.(nextMonth);
                    trigger();
                }}>
                <Icon type="right" />
            </Button>
        </div>

        {years && <div className={style.years}>
            {new Array(21).fill(0).map((_, i) => {
                const year = new Date(date);
                year.setFullYear(year.getFullYear() + (i - 10));

                const label = year.toLocaleString(locale, { year: 'numeric' });

                return <Halo key={i}
                    color="var(--f-clr-primary-300)"
                    disabled={disabled === true}>
                    <button
                        type="button"
                        disabled={disabled === true}
                        aria-label={label}
                        className={classes(
                            style.date,
                            style.bold,
                            year.getFullYear() === date.getFullYear() && style.selected
                        )}
                        onClick={() => setDate?.(year)}>
                        {label}
                    </button>
                </Halo>;
            })}
        </div>}

        {!years && <div className={style.grid} role="grid">
            <div className={style.row} role="row">
                {new Array(7).fill(0).map((_, i) => (
                    <div key={i} className={style.label} role="columnheader">
                        {offsetDate(firstMonday, i).toLocaleString(locale, { weekday: 'narrow' })}
                    </div>
                ))}
            </div>

            <Animatable
                animate={{
                    translate: ['0px 0px', '8px 0px'],
                    opacity: [1, 0],
                    duration: .25,
                    reverse: true,
                    easing: 'ease-in'
                }}
                stagger={.05}
                triggers={[
                    { on: trigger }
                ]}>
                {new Array(6).fill(0).map((_, ri) => (
                    <div key={ri} className={style.row} role="row">
                        {new Array(7).fill(0).map((_, ci) => {
                            const index = ri * 7 + ci,
                                day = offsetDate(firstMonday, index),
                                dayDisabled = Array.isArray(disabled) ? disabled.some(val => isEqual(val, day)) : disabled;

                            return <div key={ci} role="gridcell">
                                <Halo color="var(--f-clr-primary-300)" disabled={dayDisabled}>
                                    <button
                                        ref={el => {
                                            dates.current[index] = el;
                                        }}
                                        type="button"
                                        disabled={dayDisabled}
                                        aria-label={day.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })}
                                        className={classes(
                                            style.date,
                                            day.getMonth() === date.getMonth() && style.bold,
                                            isEqual(new Date(), day) && style.today,
                                            isEqual(date, day) && style.selected,
                                            dayDisabled && Array.isArray(disabled) && style.unavailable
                                        )}
                                        onClick={() => setDate?.(day)}
                                        onKeyDown={e => {
                                            // control focus with keyboard
                                            let next: number | null = null;

                                            switch (e.key) {
                                                case 'ArrowRight':
                                                    next = index + 1;
                                                    break;
                                                case 'ArrowLeft':
                                                    next = index - 1;
                                                    break;
                                                case 'ArrowDown':
                                                    next = index + 7;
                                                    break;
                                                case 'ArrowUp':
                                                    next = index - 7;
                                                    break;
                                            }

                                            if (next !== null) {
                                                if (next < 0) setDate?.(prevMonth);
                                                if (next >= 42) setDate?.(nextMonth);

                                                next = next % 42;
                                                next = next < 0 ? 42 + next : next;
                                                dates.current[next]?.focus();

                                                e.preventDefault();
                                            }
                                        }}>

                                        {day.getDate()}
                                    </button>
                                </Halo>
                            </div>;
                        })}
                    </div>
                ))}
            </Animatable>
        </div>}
    </div>;
}