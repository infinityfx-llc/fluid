'use client';

import { classes, combineClasses, combineRefs } from '../../../src/core/utils';
import { Selectors } from '../../../src/types';
import { useEffect, useRef, useState } from 'react';
import { createStyles } from '../../core/style';
import { Animate } from '@infinityfx/lively';
import { useLink, useSpring } from '@infinityfx/lively/hooks';
import Interactable from '../feedback/interactable';
import useInputProps from '../../hooks/use-input-props';

function toCircularValue(value: number, min: number, max: number, step: number) {
    const count = Math.floor((max - min) / step) + 1;
    const index = ((value % count) + count) % count;

    return min + index * step;
}

const styles = createStyles('dial', {
    '.dial': {
        position: 'relative',
        isolation: 'isolate',
        display: 'flex',
        alignItems: 'center',
        height: 'calc(1em * var(--rows) * var(--row-height))',
        overflow: 'hidden',
        maskImage: 'linear-gradient(transparent, black calc(1em * var(--row-height)), black calc(1em * (var(--rows) - 1) * var(--row-height)), transparent)',
        userSelect: 'none',
        touchAction: 'none',
        cursor: 'move',
        outline: 'none'
    },

    '.dial[aria-disabled="true"]': {
        cursor: 'default',
        color: 'var(--f-clr-grey-500)'
    },

    '.column': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },

    '.column > *': {
        flexShrink: 0,
        height: 'calc(1em * var(--row-height))',
        lineHeight: 'var(--row-height)'
    },

    '.selection': {
        left: '.1em',
        position: 'absolute',
        height: 'calc(1em * var(--row-height) - .2em)',
        width: 'calc(100% - .2em)',
        borderRadius: 'calc(var(--f-radius-med) - .1em)',
        zIndex: -1
    }
});

export type DialSelectors = Selectors<'dial' | 'column'>;

/**
 * An infinite circular number input.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/dial}
 */
export default function Dial({ children, cc = {}, min, max, step = 1, rows = 4, rowHeight = 1.2, value, defaultValue, onChange, disabled, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: DialSelectors;
        min: number;
        max: number;
        step?: number;
        rows?: number;
        rowHeight?: number;
        value?: number;
        defaultValue?: number;
        onChange?: (value: number) => void;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'>) {
    const style = combineClasses(styles, cc);

    const [split, rest] = useInputProps(props);
    const dial = useRef<HTMLDivElement>(null);
    const link = useSpring(0, { mass: 2, stiffness: 1.8 });
    const target = useRef(0);
    const translate = useLink(link, val => `0em ${val * rowHeight}em`);
    const data = useRef({
        y: -1,
        fontSize: 16,
        pointerId: 0
    });

    const [state, setState] = value !== undefined ? [value, onChange] : useState(defaultValue ?? min);
    const [center, setCenter] = useState(Math.round((state - min) / step));
    const windowCenterRef = useRef(center);
    const previousValue = useRef(state);

    const view = rows % 2 === 0 ? rows + 1 : rows;
    const viewSize = view * 3;
    const maxLength = Math.max(min.toString().length, max.toString().length);

    function update(value: number, duration?: number) {
        if (disabled) return;

        link.set(target.current = value, { duration });

        const currentStepIndex = windowCenterRef.current - Math.round(value);
        const updatedValue = toCircularValue(currentStepIndex, min, max, step);

        if (updatedValue !== previousValue.current) {
            previousValue.current = updatedValue;

            setState?.(updatedValue);
            onChange?.(updatedValue);
        }
    }

    function snap(e: React.PointerEvent) {
        if (data.current.pointerId === e.pointerId &&
            e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        update(Math.round(target.current));
        data.current.y = -1;
    }

    useEffect(() => {
        return link.on('change', val => {
            const chunkDelta = Math.trunc(val / view);

            if (chunkDelta !== 0) {
                const shiftSteps = chunkDelta * view;
                const nextCenter = windowCenterRef.current - shiftSteps;

                setCenter(windowCenterRef.current = nextCenter);
                link.set(val - shiftSteps, { duration: 0 });
                target.current -= shiftSteps;
                link.set(target.current);
            }
        });
    }, [view, min, max, step]);

    useEffect(() => {
        if (!dial.current) return;

        if (split.autoFocus) dial.current.focus();

        const ctrl = new AbortController();
        dial.current.addEventListener('wheel', e => {
            update(Math.round(target.current) + Math.sign(e.deltaY));

            e.preventDefault();
        }, { signal: ctrl.signal });

        dial.current.addEventListener('touchmove', e => {
            if (data.current.y >= 0) e.preventDefault();
        }, { signal: ctrl.signal });

        return () => ctrl.abort();
    }, [split.autoFocus, disabled, onChange]);

    useEffect(() => {
        if (value === undefined || value === previousValue.current) return;
        setState?.(previousValue.current = value);

        const count = Math.floor((max - min) / step) + 1; // todo: refactor
        const positiveModulo = (n: number, m: number) => ((n % m) + m) % m;

        const targetWrappedIndex = Math.round((value - min) / step);
        const currentStepIndex = windowCenterRef.current - target.current;

        const currentWrappedIndex = positiveModulo(Math.round(currentStepIndex), count);
        let delta = positiveModulo(targetWrappedIndex - currentWrappedIndex, count);
        if (delta > count / 2) delta -= count;

        if (delta !== 0) update(target.current - delta);
    }, [value, min, max, step, disabled]);

    return <div
        {...rest}
        tabIndex={disabled ? -1 : 0}
        role="spinbutton"
        aria-valuenow={state}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-disabled={disabled}
        ref={combineRefs(dial, props.ref)}
        className={classes(
            style.dial,
            props.className
        )}
        style={{
            ...props.style,
            '--row-height': rowHeight,
            '--rows': rows
        } as any}
        onTouchStart={e => {
            rest.onTouchStart?.(e);
            e.stopPropagation();
        }}
        onPointerDown={e => {
            rest.onPointerDown?.(e);

            if (data.current.y >= 0) return;

            if (e.pointerType === 'mouse') {
                e.currentTarget.setPointerCapture(e.pointerId);
            }

            const fontSize = parseFloat(getComputedStyle(e.currentTarget).fontSize);

            data.current.pointerId = e.pointerId;
            data.current.fontSize = isNaN(fontSize) ? 16 : fontSize;
            data.current.y = e.clientY;

            e.stopPropagation();
        }}
        onPointerMove={e => {
            if (data.current.y < 0) return;

            update(link.get() + (e.clientY - data.current.y) / (data.current.fontSize * rowHeight), 0);

            data.current.y = e.clientY;
        }}
        onPointerUp={snap}
        onPointerCancel={snap}
        onKeyDown={e => {
            rest.onKeyDown?.(e);

            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                update(Math.round(target.current) + (e.key === 'ArrowDown' ? -1 : 1));

                e.stopPropagation();
                e.preventDefault();
            }
        }}>
        <Interactable
            as="div"
            noHover
            disabled={disabled}
            highlightColor="var(--f-clr-primary-400)"
            interactTarget={dial.current}
            className={style.selection} />

        <Animate animate={{
            translate
        }}>
            <div className={style.column} aria-hidden>
                {Array.from({ length: viewSize }, (_, i) => {
                    const index = center - Math.floor(viewSize / 2) + i;
                    const value = toCircularValue(index, min, max, step);
                    const formatted = (value < 0 ? '-' : '' + Math.abs(value)).padStart(maxLength, '0');

                    return <span key={i}>{formatted}</span>;
                })}
            </div>
        </Animate>

        <input {...split} type="hidden" value={state} />
    </div>;
}