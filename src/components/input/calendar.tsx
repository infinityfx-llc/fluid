'use client';

import { FluidSize, Selectors } from "../../../src/types";
import { useRef, useState } from "react";
import Button from "./button";
import { classes, combineClasses } from "../../../src/core/utils";
import { createStyles } from "../../core/style";
import NumberField from "./number-field";
import { Icon } from "../../core/icons";

// multiple/range select

function isEqual(a: Date, b: Date) {
    return a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const styles = createStyles('calendar', {
    '.calendar': {
        backgroundColor: 'var(--f-clr-fg-100)',
        padding: '.6em',
        borderRadius: 'var(--f-radius-sml)'
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
        marginBottom: '.6em',
        gap: '.6em'
    },

    '.calendar .year': {
        flexGrow: 1,
        minWidth: 'auto'
    },

    '.calendar .year__content': {
        padding: '.475em'
    },

    '.calendar .field': {
        background: 'transparent',
        outline: 'none'
    },

    '.grid': {
        display: 'flex',
        flexDirection: 'column'
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

    '.calendar .date': {
        fontSize: '1em',
        width: '2.3em',
        height: '2.3em'
    },

    '.calendar .date[data-present="false"]': {
        color: 'var(--f-clr-grey-400)',
        fontWeight: 400
    },

    '.calendar .date__v__minimal:disabled': {
        background: 'none'
    },

    '.calendar .button, .calendar .button:disabled': {
        background: 'var(--f-clr-bg-100)'
    }
});

export type CalendarSelectors = Selectors<'calendar' | 'header' | 'text' | 'years' | 'round' | 's__xsm' | 's__sml' | 's__med' | 's__lrg'>;

export default function Calendar({ cc = {}, locale, size = 'med', round, defaultValue, value, onChange, disabled, ...props }:
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

    const dates = useRef<(HTMLButtonElement | null)[]>([]);
    const [partialYear, setPartialYear] = useState<null | string>(null);
    const [dateState, setDate] = value !== undefined ? [value, onChange] : useState(defaultValue);
    const date = dateState || new Date();

    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    const monday = new Date(first), day = first.getDay();
    monday.setDate(first.getDate() - (day || 7) + 1);

    try {
        new Intl.Locale(locale as any);
    } catch (ex) {
        locale = 'en';
    }

    const nextMonth = new Date(date);
    nextMonth.setMonth(date.getMonth() + 1);
    const prevMonth = new Date(date);
    prevMonth.setMonth(date.getMonth() - 1);

    const buttonProps = {
        size,
        round,
        compact: true,
        disabled: disabled === true,
        variant: 'minimal' as const,
        cc: { button: style.button }
    };

    return <div {...props} className={classes(
        style.calendar,
        round && style.round,
        style[`s__${size}`],
        props.className
    )}>
        <div className={style.header}>
            <Button {...buttonProps} onClick={() => setDate?.(prevMonth)} aria-label={prevMonth.toLocaleString(locale, { month: 'long' })}>
                <Icon type="left" />
            </Button>

            <NumberField
                size={size}
                round={round}
                precision={0}
                controls={false}
                cc={{
                    wrapper: style.year,
                    field: style.field,
                    content: style.year__content,
                    ...cc
                }}
                disabled={disabled === true}
                icon={date.toLocaleString(locale, { month: 'long' })}
                value={partialYear !== null ? partialYear : date.toLocaleString(locale, { year: 'numeric' })}
                onChange={e => {
                    setPartialYear(e.target.value);
                    const updated = new Date(date);
                    updated.setFullYear(parseInt(e.target.value));

                    if (!isNaN(updated.getTime()) && setDate) setDate(updated);
                }}
                onBlur={() => setPartialYear(null)} />

            <Button {...buttonProps} onClick={() => setDate?.(nextMonth)} aria-label={nextMonth.toLocaleString(locale, { month: 'long' })}>
                <Icon type="right" />
            </Button>
        </div>

        <div className={style.grid} role="grid">
            <div className={style.row} role="row">
                {new Array(7).fill(0).map((_, i) => {
                    const day = new Date(monday);
                    day.setDate(monday.getDate() + i);

                    return <div key={i} className={style.label} role="columnheader">
                        {day.toLocaleString(locale, { weekday: 'short' })}
                    </div>;
                })}
            </div>

            {new Array(6).fill(0).map((_, ri) => (
                <div key={ri} className={style.row} role="row">
                    {new Array(7).fill(0).map((_, ci) => {
                        const day = new Date(monday), index = ri * 7 + ci;
                        day.setDate(monday.getDate() + index);
                        const isMonth = day.getMonth() === date.getMonth();

                        const isDisabled = Array.isArray(disabled) ? disabled.some(val => isEqual(val, day)) : disabled;

                        return <div key={ci} role="gridcell">
                            <Button
                                ref={el => {
                                    dates.current[index] = el;
                                }}
                                disabled={isDisabled}
                                round={round}
                                cc={{
                                    button: style.date,
                                    v__minimal: style.date__v__minimal
                                }}
                                data-present={isMonth}
                                variant={isEqual(date, day) ? 'default' : 'minimal'}
                                aria-label={day.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })}
                                onClick={() => setDate?.(day)}
                                onKeyDown={e => {
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
                            </Button>
                        </div>;
                    })}
                </div>
            ))}
        </div>
    </div>;
}