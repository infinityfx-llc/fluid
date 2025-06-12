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
import { LayoutGroup } from "@infinityfx/lively/layout";

// multiple/range select

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
        borderRadius: 'var(--f-radius-med)',
        padding: '.6em'
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

    '.toggle': {
        fontWeight: 600,
        flexGrow: 1
    },

    '.hidden': {
        opacity: 0,
        pointerEvents: 'none'
    },

    '.header': {
        display: 'flex',
        alignItems: 'center',
        gap: '.6em',
        marginBottom: '.6em'
    },

    '.header > *': {
        transition: 'opacity .35s'
    },

    '.content': {
        position: 'relative',
        display: 'grid'
    },

    '.grid': {
        display: 'flex',
        flexDirection: 'column',
        rowGap: 'var(--f-spacing-xxs)',
        gridArea: '1 / 1'
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

    '.years.grid': {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        zIndex: 1,
        backgroundColor: 'var(--f-clr-fg-100)'
    },

    '.dates .date': {
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

export type CalendarSelectors = Selectors<'calendar' | 's__xsm' | 's__sml' | 's__med' | 's__lrg' | 'round' | 'header' | 'content' | 'grid' | 'row' | 'label' | 'date' | 'dates' | 'years' | 'unavailable' | 'bold' | 'today' | 'selected'>;

/**
 * An input used for selecting a date.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/calendar}
 */
export default function Calendar({ cc = {}, locale, size = 'med', round, defaultValue, value, onChange, disabled = false, minDate, maxDate, ...props }:
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
        minDate?: Date;
        maxDate?: Date;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'children' | 'onChange'>) {
    const style = combineClasses(styles, cc);

    const left = useTrigger();
    const right = useTrigger();
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

    function update(newDate: Date) {
        setDate?.(newDate);

        const dt = date.getMonth() - newDate.getMonth();
        if (dt > 0) left();
        if (dt < 0) right();
    }

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
                className={years ? style.hidden : undefined}
                aria-label={prevMonth.toLocaleString(locale, { month: 'long' })}
                onClick={() => update(prevMonth)}>
                <Icon type="left" />
            </Button>

            <Toggle
                {...buttonProps}
                variant="default"
                checked={years}
                onChange={e => setYears(e.target.checked)}
                className={style.toggle}>
                {date.toLocaleString(locale, { month: 'long', year: 'numeric' })}
                <Icon type="expand" />
            </Toggle>

            <Button
                {...buttonProps}
                className={years ? style.hidden : undefined}
                aria-label={nextMonth.toLocaleString(locale, { month: 'long' })}
                onClick={() => update(nextMonth)}>
                <Icon type="right" />
            </Button>
        </div>

        <div className={style.content}>
            <LayoutGroup
                transition={{
                    duration: .35,
                    easing: 'ease-out'
                }}>
                {years && <Animatable
                    id="years"
                    passthrough
                    traverseLayout
                    animate={{
                        opacity: [0, 1],
                        duration: .35
                    }}
                    triggers={[
                        { on: 'mount' },
                        { on: 'unmount', reverse: true }
                    ]}>
                    <div
                        role="grid"
                        className={classes(
                            style.grid,
                            style.years
                        )}>
                        {new Array(21).fill(0).map((_, i) => {
                            const year = new Date(date),
                                current = Math.round(year.getFullYear() / 3) * 3;
                            year.setFullYear(current + i - 10);

                            const startOfYear = new Date(year.getFullYear(), 1, 1),
                                label = year.toLocaleString(locale, { year: 'numeric' }),
                                yearDisabled = disabled === true ||
                                    (minDate ? minDate > startOfYear : false) ||
                                    (maxDate ? maxDate < startOfYear : false);

                            return <Animatable
                                key={label}
                                id={label}
                                adaptive
                                cachable={['y']}
                                animate={{
                                    opacity: [0, 1],
                                    duration: .25,
                                    easing: 'ease-out',
                                    delay: .35 + Math.abs(3 - Math.floor(i / 3)) * .05
                                }}
                                triggers={[
                                    { on: 'mount' }
                                ]}>
                                <Halo
                                    color="var(--f-clr-primary-300)"
                                    disabled={yearDisabled}>
                                    <button
                                        type="button"
                                        disabled={yearDisabled}
                                        aria-label={label}
                                        className={classes(
                                            style.date,
                                            style.bold,
                                            year.getFullYear() === date.getFullYear() && style.selected
                                        )}
                                        onClick={() => update(year)}>
                                        {label}
                                    </button>
                                </Halo>
                            </Animatable>;
                        })}
                    </div>
                </Animatable>}
            </LayoutGroup>

            <div
                role="grid"
                className={classes(
                    style.grid,
                    style.dates
                )}>
                <div className={style.row} role="row">
                    {new Array(7).fill(0).map((_, i) => (
                        <div key={i} className={style.label} role="columnheader">
                            {offsetDate(firstMonday, i).toLocaleString(locale, { weekday: 'narrow' })}
                        </div>
                    ))}
                </div>

                <Animatable
                    animations={{
                        left: {
                            translate: ['-8px 0px', '0px 0px'],
                            opacity: [0, 1],
                            duration: .25,
                            easing: 'ease-out'
                        },
                        right: {
                            translate: ['8px 0px', '0px 0px'],
                            opacity: [0, 1],
                            duration: .25,
                            easing: 'ease-out'
                        }
                    }}
                    stagger={.05}
                    triggers={[
                        { name: 'left', on: left, immediate: true },
                        { name: 'right', on: right, immediate: true }
                    ]}>
                    {new Array(6).fill(0).map((_, ri) => (
                        <div key={ri} className={style.row} role="row">
                            {new Array(7).fill(0).map((_, ci) => {
                                const index = ri * 7 + ci,
                                    day = offsetDate(firstMonday, index),
                                    dayDisabled = (Array.isArray(disabled) ? disabled.some(val => isEqual(val, day)) : disabled) ||
                                        (minDate ? minDate > day : false) ||
                                        (maxDate ? maxDate < day : false);

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
                                            onClick={() => update(day)}
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
                                                    if (next < 0) update(prevMonth);
                                                    if (next >= 42) update(nextMonth);

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
            </div>
        </div>
    </div>;
}