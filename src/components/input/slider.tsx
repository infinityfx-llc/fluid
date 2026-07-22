'use client';

import { Selectors } from "../../../src/types";
import { useId, useRef, useState, useEffect } from "react";
import { classes, combineClasses, round, toNumber } from "../../../src/core/utils";
import Tooltip from "../display/tooltip";
import useInputProps from "../../../src/hooks/use-input-props";
import { createStyles } from "../../core/style";
import Interactable from "../feedback/interactable";

const styles = createStyles('slider', {
    '.wrapper': {
        display: 'flex',
        flexDirection: 'column'
    },

    '.wrapper:not(.vertical)': {
        minWidth: 'min(100vw, 12em)',
        gap: 'var(--f-spacing-xsm)'
    },

    '.wrapper.vertical': {
        minHeight: 'min(100vh, 12em)',
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
        margin: 'auto',
        width: 'calc(100% - 1.1em)',
        height: '1.1em',
        userSelect: 'none',
        flexGrow: 1,
        touchAction: 'none',
        WebkitTapHighlightColor: 'transparent'
    },

    '.wrapper.vertical .slider': {
        order: -1,
        flexDirection: 'column',
        height: 'calc(100% - 1.1em)',
        width: '1.1em'
    },

    '.track': {
        position: 'relative',
        height: '.4em',
        borderRadius: '999px',
        backgroundColor: 'var(--f-clr-surface-200)',
        overflow: 'hidden',
        flexGrow: 1
    },

    '.wrapper.vertical .track': {
        width: '.4em'
    },

    '.progress': {
        backgroundColor: 'var(--f-clr-primary-100)',
        width: '100%',
        height: '100%',
        transformOrigin: 'bottom left',
        willChange: 'transform'
    },

    '.handle': {
        position: 'absolute',
        translate: '-50% 0%',
        width: '1.1em',
        height: '1.1em',
        borderRadius: '99px',
        touchAction: 'none'
    },

    '.wrapper.vertical .handle': {
        translate: '0% 50%',
    },

    '.handle::after': {
        content: '""',
        display: 'block',
        width: '100%',
        height: '100%',
        borderRadius: '99px',
        backgroundColor: 'white',
        boxShadow: 'var(--f-shadow-med)'
    },

    '.slider[data-disabled="false"]': {
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

    '.handle .highlight': {
        inset: '-.5em'
    }
});

export type SliderSelectors = Selectors<'wrapper' | 'vertical' | 'label' | 'slider' | 'track' | 'progress' | 'handle'>;

/**
 * An input that allows for selecting 1 or multiple values from a given range.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/slider}
 */
export default function Slider({ cc = {}, handles = 1, vertical = false, tooltips = 'interact', formatTooltip, label, value, defaultValue, onChange, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: SliderSelectors;
        /**
         * The number of handles this Slider should have.
         * 
         * @default 1
         */
        handles?: number;
        /**
         * @default false
         */
        vertical?: boolean;
        /**
         * When to display a tooltip for a handle.
         * 
         * @default "interact"
         */
        tooltips?: 'never' | 'interact' | 'always';
        formatTooltip?: (value: number) => string;
        label?: string;
        value?: number[];
        defaultValue?: number[];
        onChange?: (values: number[]) => void;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'value' | 'defaultValue' | 'onChange'>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const slider = useRef<HTMLDivElement>(null);
    const track = useRef<HTMLDivElement>(null);
    const data = useRef({
        pointerId: 0,
        dragIndex: null as number | null
    });

    const max = toNumber(props.max, 1);
    const min = toNumber(props.min, 0);
    const step = toNumber(props.step, 0.1);
    const toOffset = (val: number) => (val - min) / (max - min);
    const toValue = (val: number) => min + val * (max - min);

    // get the initialization values based on the amount of handles and the "defaultValue" prop
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

    // update the value of a handle depending on pointer position
    function change(clientPos: number) {
        if (!track.current || props.disabled) return null;

        const { y, height, x, width } = track.current.getBoundingClientRect();
        const value = toValue(vertical ? 1 - (clientPos - y) / height : (clientPos - x) / width);

        // if a handle is currently being dragged use that one
        // else find the handle nearest to the current pointer position
        data.current.dragIndex = data.current.dragIndex === null ?
            values.reduce((res, val, i) => {
                const d = Math.abs(val - value);
                return d < res[0] ? [d, i] : res;
            }, [Number.MAX_VALUE, 0])[1] :
            data.current.dragIndex;

        update(data.current.dragIndex, value);

        return data.current.dragIndex;
    }

    // update the value of a handle given an index
    function update(index: number, value: number) {
        if (index > 0) value = Math.max(value, values[index - 1] + step); // value can not be smaller than previous handle's value 
        if (index < handles - 1) value = Math.min(value, values[index + 1] - step); // value can not be larger than next handle's value
        value = Math.min(Math.max(Math.round(value / step) * step, min), max); // round value to the nearest step size

        if (value === values[index]) return;

        const updated = values.slice();
        updated[index] = value;

        setValues?.(updated);
        onChange?.(updated);
    }

    function release(e: React.PointerEvent) {
        if (data.current.pointerId === e.pointerId &&
            e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        data.current.dragIndex = null;
    }

    const [split, rest] = useInputProps(props);

    useEffect(() => {
        if (!slider.current) return;

        const ctrl = new AbortController();

        slider.current.addEventListener('touchmove', e => {
            if (data.current.dragIndex !== null) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, { signal: ctrl.signal });

        return () => ctrl.abort();
    }, []);

    let scale = toOffset(values[0]);
    const offset = handles < 2 ? 0 : scale;
    if (handles > 1) scale = toOffset(values[handles - 1]) - scale;

    return <div
        {...rest}
        className={classes(
            style.wrapper,
            vertical && style.vertical,
            props.className
        )}>
        <input {...split} type="hidden" value={values.join(',')} />

        {label && <div id={id} className={style.label}>{label}</div>}

        <div
            ref={slider}
            className={style.slider}
            data-disabled={!!props.disabled}
            onPointerDown={e => {
                rest.onPointerDown?.(e);

                if (props.disabled) return;

                const index = change(vertical ? e.clientY : e.clientX);
                const handle = index !== null ? e.currentTarget.querySelectorAll<HTMLElement>('[role="slider"]')[index] : null;

                if (handle) {
                    handle.setPointerCapture(e.pointerId);
                    data.current.pointerId = e.pointerId;
                    e.stopPropagation();

                    if (e.pointerType === 'touch') {
                        requestAnimationFrame(() => {
                            try {
                                const event = new Event('touchstart', {
                                    bubbles: true,
                                    cancelable: true
                                });

                                (event as any).touches = (event as any).changedTouches = [{
                                    clientX: e.clientX,
                                    clientY: e.clientY,
                                    target: handle
                                }];

                                handle.dispatchEvent(event);
                            } catch (err) { console.log(err) }
                        });
                    }
                }
            }}
            onPointerMove={e => {
                if (data.current.dragIndex === null) return;

                change(vertical ? e.clientY : e.clientX);
            }}
            onPointerUp={release}
            onPointerCancel={release}>
            <div ref={track} className={style.track}>
                <div className={style.progress} style={{
                    scale: vertical ? `1 ${scale}` : `${scale} 1`,
                    translate: vertical ? `0% ${offset * -100}%` : `${offset * 100}% 0%`
                }} />
            </div>

            {new Array(handles).fill(0).map((_, i) => {
                const val = values[i];

                return <Tooltip
                    key={i}
                    delay={0}
                    content={formatTooltip ? formatTooltip(round(val, 2)) : round(val, 2)}
                    visibility={tooltips}
                    position={vertical ? 'right' : 'bottom'}>
                    <Interactable
                        as="div"
                        role="slider"
                        className={style.handle}
                        tabIndex={props.disabled ? -1 : 0}
                        aria-disabled={!!props.disabled}
                        disabled={props.disabled}
                        cc={{ highlight: style.highlight }}
                        onPointerDown={e => {
                            data.current.dragIndex = i;

                            if (e.pointerType === 'mouse') {
                                e.currentTarget.setPointerCapture(e.pointerId);
                                data.current.pointerId = e.pointerId;
                            }

                            e.stopPropagation();
                        }}
                        onKeyDown={e => {
                            const value = {
                                ArrowUp: val + step,
                                ArrowRight: val + step,
                                ArrowDown: val - step,
                                ArrowLeft: val - step,
                                Home: min,
                                End: max
                            }[e.key];

                            if (value === undefined) return;

                            e.preventDefault();
                            update(i, value);
                        }}
                        aria-valuenow={val}
                        aria-valuemin={values[i - 1] || 0}
                        aria-valuemax={values[i + 1] || 1}
                        aria-orientation={vertical ? 'vertical' : 'horizontal'}
                        aria-label={split["aria-label"]}
                        aria-labelledby={label ? id : undefined}
                        style={{
                            [vertical ? 'bottom' : 'left']: `${toOffset(val) * 100}%`
                        }} />
                </Tooltip>;
            })}
        </div>
    </div >;
}
