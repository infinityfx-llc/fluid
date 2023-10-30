'use client';

import { FluidStyles, Selectors } from "../../../src/types";
import { forwardRef, useId, useRef, useState, useEffect } from "react";
import Halo from "../feedback/halo";
import { classes, combineClasses, round, toNumber } from "../../../src/core/utils";
import Tooltip from "../display/tooltip";
import useInputProps from "../../../src/hooks/use-input-props";
import { createStyles } from "../../core/style";

const Slider = forwardRef(({ cc = {}, handles = 1, vertical = false, tooltips = 'interact', formatTooltip, label, value, defaultValue, onChange, ...props }:
    {
        cc?: Selectors<'wrapper' | 'label' | 'slider' | 'track' | 'progress' | 'handle' | 'halo'>;
        handles?: number;
        vertical?: boolean;
        tooltips?: 'never' | 'interact' | 'always';
        formatTooltip?: (value: number) => string;
        label?: string;
        value?: number[];
        defaultValue?: number[];
        onChange?: (values: number[]) => void;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'value' | 'defaultValue' | 'onChange'>, ref: React.ForwardedRef<any>) => {
    const styles = createStyles('slider', {
        '.wrapper': {
            display: 'flex',
            flexDirection: 'column'
        },

        '.wrapper[data-vertical="false"]': {
            minWidth: 'clamp(0px, 12em, 100vw)',
            gap: 'var(--f-spacing-xsm)'
        },

        '.wrapper[data-vertical="true"]': {
            height: 'clamp(0px, 12em, 100vw)',
            gap: 'var(--f-spacing-med)'
        },

        '.label': {
            fontSize: '.8em',
            fontWeight: 500,
            color: 'var(--f-clr-text-100)'
        },

        '.slider': {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginInline: 'auto',
            width: 'calc(100% - 1.1em)',
            height: '1.1em',
            userSelect: 'none'
        },

        '.wrapper[data-vertical="true"] .slider': {
            order: -1,
            height: 'calc(100% - 1.1em)',
            width: '1.1em'
        },

        '.track': {
            width: '100%',
            height: '.4em',
            borderRadius: '999px',
            backgroundColor: 'var(--f-clr-fg-200)',
            overflow: 'hidden'
        },

        '.wrapper[data-vertical="true"] .track': {
            width: '.4em',
            height: '100%'
        },

        '.progress': {
            backgroundColor: 'var(--f-clr-primary-100)',
            height: '100%',
            width: '100%',
            transformOrigin: 'top left',
            willChange: 'transform'
        },

        '.handle': {
            position: 'absolute',
            translate: '-50% 0%',
            width: '1.1em',
            height: '1.1em',
            outline: 'none',
            borderRadius: '99px'
        },

        '.wrapper[data-vertical="true"] .handle': {
            translate: '0% -50%',
        },

        '.handle::after': {
            content: '""',
            display: 'block',
            width: '100%',
            height: '100%',
            borderRadius: '99px',
            backgroundColor: 'white',
            boxShadow: '0 0 8px rgb(0, 0, 0, 0.12)',
        },

        '.slider[data-disabled="false"] .track': {
            cursor: 'pointer'
        },

        '.handle[aria-disabled="false"]': {
            cursor: 'pointer'
        },

        '.handle[aria-disabled="true"]': {
            width: '.8em',
            height: '.8em'
        },

        '.handle[aria-disabled="true"]::after': {
            backgroundColor: 'var(--f-clr-grey-200)'
        },

        '.slider[data-disabled="true"] .progress': {
            backgroundColor: 'var(--f-clr-grey-300)'
        },

        '.halo': {
            inset: '-.5em !important'
        }
    });
    const style = combineClasses(styles, cc);

    const id = useId();
    const track = useRef<HTMLDivElement | null>(null);
    const dragging = useRef<number | null>(null);
    const max = toNumber(props.max, 1);
    const min = toNumber(props.min, 0);
    const step = toNumber(props.step, 0.1);

    const toOffset = (val: number) => (val - min) / (max - min);
    const toValue = (val: number) => min + val * (max - min);

    function fromHandles() {
        const arr = new Array(handles).fill(1).map((_, i) => toValue(i / Math.max(handles - 1, 1)));

        if (defaultValue) defaultValue.forEach((val, i) => {
            arr[i] = val;
            if (i < arr.length - 2) arr[i + 1] = (arr[i + 2] + val) / 2;
        });

        return arr;
    }
    const [values, setValues] = value !== undefined ? [value] : useState(fromHandles);

    useEffect(() => setValues?.(fromHandles()), [handles]);

    function change(e: MouseEvent | TouchEvent) {
        if (!track.current || props.disabled) return;
        e.stopPropagation();

        const dp = ('touches' in e ? e.touches[0] : e)?.[vertical ? 'clientY' : 'clientX'];
        if (dp === undefined) return;

        const { y, height, x, width } = track.current.getBoundingClientRect();
        const value = toValue(vertical ? (dp - y) / height : (dp - x) / width);

        const idx = dragging.current === null || dragging.current < 0 ?
            values.reduce((res, val, i) => {
                const d = Math.abs(val - value);
                return d < res[0] ? [d, i] : res;
            }, [Number.MAX_VALUE, 0])[1] :
            dragging.current;

        update(idx, value);
    }

    function update(index: number, value: number) {
        if (index > 0) value = Math.max(value, values[index - 1] + step);
        if (index < handles - 1) value = Math.min(value, values[index + 1] - step);
        value = Math.min(Math.max(Math.round(value / step) * step, min), max);

        if (value === values[index]) return;

        const updated = values.slice();
        updated[index] = value;

        setValues?.(updated);
        onChange?.(updated);
    }

    useEffect(() => {
        const cancel = () => dragging.current = null;
        const drag = (e: MouseEvent | TouchEvent) => dragging.current !== null && change(e);

        window.addEventListener('mousemove', drag);
        window.addEventListener('touchmove', drag);
        window.addEventListener('mouseup', cancel);

        return () => {
            window.removeEventListener('mousemove', drag);
            window.removeEventListener('touchmove', drag);
            window.removeEventListener('mouseup', cancel);
        }
    }, [values, props.disabled]);

    const [split, rest] = useInputProps(props);

    let scale = toOffset(values[0]);
    const offset = handles < 2 ? 0 : scale;
    if (handles > 1) scale = toOffset(values[handles - 1]) - scale;

    return <div ref={ref} {...rest} className={classes(style.wrapper, props.className)} data-vertical={vertical}>
        <input {...split} type="hidden" value={values.join(',')} />

        {label && <div id={id} className={style.label}>{label}</div>}

        <div className={style.slider} data-disabled={!!props.disabled}>
            <div ref={track} className={style.track}
                onTouchEnd={() => dragging.current = -1}
                onMouseDown={e => {
                    e.stopPropagation();
                    dragging.current = -1;
                    change(e.nativeEvent);
                }}
                onTouchStart={e => {
                    e.stopPropagation();
                    dragging.current = -1;
                    change(e.nativeEvent);
                }}>
                <div className={style.progress} style={{
                    scale: vertical ? `1 ${scale}` : `${scale} 1`,
                    translate: vertical ? `0% ${offset * 100}%` : `${offset * 100}% 0%`
                }} />
            </div>

            {new Array(handles).fill(0).map((_, i) => {
                const val = values[i];

                return <Tooltip key={i} delay={0} content={formatTooltip ? formatTooltip(round(val, 2)) : round(val, 2)} visibility={tooltips} position={vertical ? 'right' : 'bottom'}>
                    <Halo disabled={props.disabled} cc={{ halo: style.halo }}>
                        <div className={style.handle} role="slider" tabIndex={props.disabled ? -1 : 0} aria-disabled={!!props.disabled}
                            onMouseDown={e => {
                                e.stopPropagation();
                                dragging.current = i;
                            }}
                            onTouchStart={e => {
                                e.stopPropagation();
                                dragging.current = i;
                            }}
                            onTouchEnd={() => dragging.current = -1}
                            onKeyDown={e => {
                                switch (e.key) {
                                    case 'ArrowUp':
                                    case 'ArrowRight': return update(i, val + step * (vertical ? -1 : 1));
                                    case 'ArrowDown':
                                    case 'ArrowLeft': return update(i, val - step * (vertical ? -1 : 1));
                                    case 'Home': return update(i, min);
                                    case 'End': return update(i, max);
                                }
                            }}
                            aria-valuenow={val}
                            aria-valuemin={values[i - 1] || 0}
                            aria-valuemax={values[i + 1] || 1}
                            aria-orientation={vertical ? 'vertical' : 'horizontal'}
                            aria-labelledby={label ? id : undefined}
                            style={{
                                [vertical ? 'top' : 'left']: `${toOffset(val) * 100}%`
                            }} />
                    </Halo>
                </Tooltip>;
            })}
        </div>
    </div >;
});

Slider.displayName = 'Slider';

export default Slider;