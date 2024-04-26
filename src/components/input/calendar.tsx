'use client';

import { FluidSize, FluidStyles, Selectors } from "../../../src/types";
import { forwardRef, useState } from "react";
import Button from "./button";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { classes, combineClasses } from "../../../src/core/utils";
import { createStyles } from "../../core/style";
import NumberField from "./number-field";

// add arrow key support for focus

export type CalendarStyles = FluidStyles<'.calendar' | '.header' | '.text' | '.years' | '.calendar__round' | '.calendar__xsm' | '.calendar__sml' | '.calendar__med' | '.calendar__lrg'>;

const Calendar = forwardRef(({ cc = {}, locale, size = 'med', round, defaultValue, value, onChange, disabled, ...props }:
    {
        cc?: Selectors<'calendar' | 'header' | 'text' | 'years' | 'calendar__round' | 'calendar__xsm' | 'calendar__sml' | 'calendar__med' | 'calendar__lrg'>;
        locale?: Intl.LocalesArgument;
        size?: FluidSize;
        round?: boolean;
        value?: Date | null;
        defaultValue?: Date;
        onChange?: (value: Date) => void;
        disabled?: boolean | Date[];
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'children' | 'onChange'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('calendar', {
        '.calendar': {
            backgroundColor: 'var(--f-clr-fg-100)',
            padding: '.6em',
            borderRadius: 'var(--f-radius-sml)'
        },

        '.calendar__xsm': {
            fontSize: 'var(--f-font-size-xxs)'
        },

        '.calendar__sml': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.calendar__med': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.calendar__lrg': {
            fontSize: 'var(--f-font-size-med)'
        },

        '.calendar__round': {
            borderRadius: 'var(--f-radius-xlg)'
        },

        '.header': {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '.6em',
            gap: '.6em'
        },

        '.year': {
            minWidth: 'auto !important',
            flexGrow: 1
        },

        '.year .field': {
            padding: 'calc(.5em - 1px) !important'
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

        '.date__var__minimal:disabled': {
            background: 'none !important'
        },

        '.date__var__default:disabled': {
            backgroundColor: 'var(--f-clr-grey-200) !important',
            color: 'var(--f-clr-text-100) !important'
        }
    });
    const style = combineClasses(styles, cc);

    const [partialYear, setPartialYear] = useState<null | string>(null);
    const [dateState, setDate] = value !== undefined ? [value, onChange] : useState(defaultValue);
    const date = dateState || new Date();

    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    const monday = new Date(first), day = first.getDay();
    monday.setDate(first.getDate() - (day || 7) + 1);

    function isEqual(a: Date, b: Date) {
        return a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    try {
        new Intl.Locale(locale as any);
    } catch (ex) {
        locale = 'en';
    }

    return <div ref={ref} {...props} className={classes(
        style.calendar,
        round && style.calendar__round,
        style[`calendar__${size}`],
        props.className
    )}>
        <div className={style.header}>
            <Button compact size={size} disabled={disabled === true} variant="minimal" round={round} onClick={() => {
                const updated = new Date(date);
                updated.setMonth(date.getMonth() - 1);
                setDate?.(updated);
            }}>
                <MdArrowBack />
            </Button>

            <NumberField
                size={size}
                round={round}
                precision={0}
                controls={false}
                cc={{
                    wrapper: style.year,
                    content: style.field
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

            <Button compact size={size} disabled={disabled === true} variant="minimal" round={round} onClick={() => {
                const updated = new Date(date);
                updated.setMonth(date.getMonth() + 1);
                setDate?.(updated);
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

                return <Button disabled={isDisabled} key={i} round={round} cc={{
                    button: style.date,
                    button__var__default: style.date__var__default,
                    button__var__minimal: style.date__var__minimal
                }} data-present={isMonth} variant={isEqual(date, day) ? 'default' : 'minimal'} onClick={() => setDate?.(day)}>
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