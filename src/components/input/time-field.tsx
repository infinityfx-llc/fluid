'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Field, { FieldProps } from "./field";
import { changeInputValue, classes, combineClasses, combineRefs } from '../../../src/core/utils';
import { createStyles } from '../../core/style';
import { PopoverContent, PopoverRoot, PopoverTrigger } from '../layout';
import { Animate } from '@infinityfx/lively';
import Dial from './dial';
import Button from './button';
import Segmented from './segmented';
import { PopoverRootReference, Selectors } from '../../types';
import { useLang } from '../../context/lang';
import { useFluid, useMediaQuery } from '../../hooks';

// parse a time string into 24h hours and minutes
function parseTime(time: string) {
    if (!time) time = new Date().toLocaleTimeString('nl', { timeStyle: 'short' });

    const [digits, suffix = ''] = time.split(' ');
    const [hr, min = 0] = digits.split(':').map(val => parseInt(val));
    const suf = ['am', 'pm'].find(val => val === suffix.toLowerCase());

    let hours = Math.min(hr, suf ? 12 : 23);
    if (suf === 'pm' && hours < 12) hours += 12;
    if (suf === 'am' && hours >= 12) hours -= 12;

    return [
        hours,
        Math.min(min, 59)
    ] as const;
}

// clamp time between a minimum and maximum time
function clampTime(hours: number, minutes: number, min?: string, max?: string) {
    const [minHr, minMins] = parseTime(min || '00:00');
    const [maxHr, maxMins] = parseTime(max || '23:59');

    if (hours <= minHr) minutes = Math.max(minutes, minMins);
    if (hours >= maxHr) minutes = Math.min(minutes, maxMins);

    return [
        Math.min(Math.max(hours, minHr), maxHr),
        minutes
    ] as const;
}

// format 24h or 12h time to a string
function timeToString(hours: number, mins: number, locale?: string, suffix = '') {
    return new Date(`01-01-1970 ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${suffix}`)
        .toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

// parse a time string to hours, minutes and a suffix string
function toLocaleTime(value: string, locale?: string) {
    const [hours, mins] = parseTime(value);
    const [hr, min, suffix = ''] = timeToString(hours, mins, locale).split(/\s|:/g);

    return [parseInt(hr), parseInt(min), suffix] as const;
}

const styles = createStyles('time-field', fluid => ({
    '.container': {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--f-spacing-sml)',
        borderRadius: 'var(--f-radius-med)',
        padding: '.6em'
    },

    '.round': {
        borderRadius: 'var(--f-radius-xlg)'
    },

    '.columns': {
        display: 'grid',
        alignItems: 'center',
        justifyItems: 'center',
        gridTemplateColumns: 'minmax(0px, 2.75rem) 1fr 2.75rem',
        gap: 'var(--f-spacing-xsm)'
    },

    '.dials': {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'var(--f-font-size-xlg)',
        gridColumn: 2
    },

    '.dials .background': {
        position: 'absolute',
        width: '100%',
        height: '1.6em',
        backgroundColor: 'var(--f-clr-bg-100)',
        borderRadius: 'var(--f-radius-med)',
        zIndex: -1
    },

    '.round .background': {
        borderRadius: '99px'
    },

    '.columns .selection': {
        backgroundColor: 'var(--f-clr-surface-200)'
    },

    '.seperator': {
        lineHeight: 1.6,
        color: 'var(--f-clr-grey-700)',
        paddingInline: '.25em'
    },

    '.dial': {
        paddingInline: '.5em'
    },

    '.buttons': {
        display: 'flex',
        gap: 'var(--f-spacing-xsm)'
    },

    '.buttons > *': {
        flexBasis: 0,
        flexGrow: 1
    },

    [`@media(min-width: ${fluid.breakpoints.mob + 1}px)`]: {
        '.dials': {
            fontSize: 'var(--f-font-size-lrg)',
            gridColumn: 'span 2'
        },

        '.dials.stretch': {
            gridColumn: 'span 3'
        }
    }
}));

export type TimeFieldSelectors = Selectors<'container' | 'columns' | 'dials' | 'stretch' | 'background' | 'seperator' | 'dial' | 'buttons'>;

/**
 * An input used for entering time.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/time-field}
 */
export default function TimeField({ cc = {}, min, max, locale, defaultValue, ...props }: {
    cc?: TimeFieldSelectors;
    /**
     * Minimum time specified in 24H-based hh:mm format.
     */
    min?: string;
    /**
     * Maximum time specified in 24H-based hh:mm format.
     */
    max?: string;
    /**
     * A language and/or region identifier, determining the displayed language.
     */
    locale?: string;
} & Omit<FieldProps, 'type' | 'min' | 'max' | 'shape'>) {
    const style = combineClasses(styles, cc);

    const { breakpoints } = useFluid();
    const isModal = useMediaQuery(`(max-width: ${breakpoints.mob}px)`);
    const lang = useLang();

    try {
        // make sure locale is valid
        if (locale !== undefined) new Intl.Locale(locale);
    } catch (ex) {
        locale = 'en';
    }

    const dial = useRef<HTMLDivElement>(null);
    const popover = useRef<PopoverRootReference>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = props.value !== undefined ? [props.value] : useState(defaultValue || '');
    const [time, setTime] = useState(toLocaleTime(value as string, locale));

    // format a string as a valid time, adhering to the min and max requirements
    const format = useCallback((value: string) => {
        if (!value) return value;

        const [hours, mins] = parseTime(value);
        const time = clampTime(hours, mins, min, max);

        return timeToString(...time, locale);
    }, [min, max, locale]);

    useEffect(() => setTime(toLocaleTime(value as string, locale)), [locale]);

    return <PopoverRoot
        ref={popover}
        stretch
        position="center"
        mobileContainer="modal">
        <PopoverTrigger disabled={props.disabled || props.readOnly}>
            <Field
                {...props}
                inputRef={combineRefs(inputRef, props.inputRef)}
                shape="%d%d:%d%d %w%w"
                inputMode="none"
                value={value}
                onChange={e => {
                    setValue?.(e.target.value);

                    props.onChange?.(e);
                }}
                onBlur={e => {
                    e.target.value = format(e.target.value);
                    setValue?.(e.target.value);
                    setTime(toLocaleTime(e.target.value, locale));

                    props.onChange?.(e);
                    props.onBlur?.(e);
                }} />
        </PopoverTrigger>

        <PopoverContent>
            <Animate
                correction="none"
                key="time-field-content"
                animate={{
                    opacity: [0, .2, 1],
                    scale: [.9, 1],
                    duration: .175
                }}
                triggers={{
                    animate: ['mount', { on: 'unmount', reverse: true }]
                }}>
                <div className={classes(
                    !isModal && 'card',
                    !isModal && 'front',
                    !isModal && 'sd-med',
                    style.container,
                    props.round && style.round
                )}>
                    <div className={style.columns}>
                        <div
                            className={classes(
                                style.dials,
                                !time[2] && style.stretch
                            )}>
                            <Dial
                                autoFocus
                                ref={dial}
                                min={0}
                                max={time[2] ? 12 : 23}
                                rows={3}
                                value={time[0]}
                                rowHeight={1.6}
                                className={style.dial}
                                onChange={val => setTime([val, time[1], time[2]])} />
                            <div className={style.seperator}>:</div>
                            <Dial
                                min={0}
                                max={59}
                                rows={3}
                                value={time[1]}
                                rowHeight={1.6}
                                className={style.dial}
                                onChange={val => setTime([time[0], val, time[2]])} />

                            <div className={style.background} />
                        </div>

                        {time[2] && <Segmented
                            vertical
                            round={props.round}
                            variant="minimal"
                            cc={{
                                selection: style.selection
                            }}
                            value={time[2]}
                            onChange={val => setTime([time[0], time[1], val])}
                            options={[
                                { label: 'AM', value: 'AM' },
                                { label: 'PM', value: 'PM' }
                            ]} />}
                    </div>

                    <div className={style.buttons}>
                        <Button
                            compact
                            round={props.round}
                            variant="muted"
                            onClick={() => {
                                setTime(toLocaleTime('', locale));

                                if (inputRef.current) changeInputValue(inputRef.current, '');
                            }}>
                            {lang.clear}
                        </Button>
                        <Button
                            compact
                            round={props.round}
                            onClick={() => {
                                if (inputRef.current) changeInputValue(inputRef.current, timeToString(time[0], time[1], locale, time[2]));

                                popover.current?.close();
                            }}>
                            {lang.save}
                        </Button>
                    </div>
                </div>
            </Animate>
        </PopoverContent>
    </PopoverRoot>;
}