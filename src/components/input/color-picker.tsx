'use client';

import { FluidSize, Selectors } from "../../../src/types";
import { forwardRef, useEffect, useRef, useState } from "react";
import { classes, combineClasses } from "../../../src/core/utils";
import { Swatch } from "../display";
import { createStyles } from "../../core/style";
import Slider from "./slider";
import Field from "./field";
import NumberField from "./number-field";

type color = [number, number, number];

function hsvToRgb([h, s, v]: color): color {
    s /= 100;
    v /= 100;

    const k = (val: number) => (val + h / 60) % 6;
    const f = (val: number) => Math.round(255 * v * (1 - s * Math.max(0, Math.min(k(val), 4 - k(val), 1))));

    return [f(5), f(3), f(1)]
}

function rgbToHsv([r, g, b]: color): color {
    r /= 255;
    g /= 255;
    b /= 255;

    const v = Math.max(r, g, b);
    const c = v - Math.min(r, g, b);

    let h = 0;
    if (c && v === r) h = (g - b) / c;
    if (c && v === g) h = 2 + (b - r) / c;
    if (c && v === b) h = 4 + (r - g) / c;

    return [
        60 * (h < 0 ? h + 6 : h),
        v && (c / v) * 100,
        v * 100
    ];
}

function rgbToHex(rgb: color) {
    return `${rgb.map(val => val.toString(16).padStart(2, '0')).join('')}`;
}

function hexToRgb(str: string): color {
    const hex = str.match(/^([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})([\da-f]{2})?$/i);
    if (!hex) return [0, 0, 0];

    return hex.slice(1, 4).map(val => parseInt(val.padStart(2, val), 16)) as color;
}

export function parsePartialHex(str: string) {    
    return rgbToHex(hexToRgb(str.replace(/[^\da-f]/g, '').slice(0, 6)))
}

// maybe sizes?

type ColorPickerProps<T> = {
    cc?: Selectors<'wrapper'>;
    format?: T;
    value?: T extends 'hex' ? string : [number, number, number];
    defaultValue?: T extends 'hex' ? string : [number, number, number];
    onChange?: (value: T extends 'hex' ? string : [number, number, number]) => void;
    disabled?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'children' | 'onChange'>;

function ColorPickerComponent<T extends 'hex' | 'rgb' = 'hex'>({ cc = {}, format, defaultValue, value, onChange, disabled, ...props }: ColorPickerProps<T>, ref: React.ForwardedRef<HTMLDivElement>) {
    const styles = createStyles('color-picker', {
        '.wrapper': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-sml)',
        },

        '.row': {
            display: 'flex',
            gap: 'var(--f-spacing-sml)'
        },

        '.column': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-sml)',
            flexGrow: 1
        },

        '.space': {
            position: 'relative',
            minWidth: '12em',
            height: '12em',
            borderRadius: 'var(--f-radius-sml)',
            backgroundBlendMode: 'multiply',
            border: 'solid 1px var(--f-clr-fg-200)',
            flexGrow: 1,
            userSelect: 'none'
        },

        '.selection': {
            position: 'absolute',
            width: '1.2em',
            height: '1.2em',
            borderRadius: '99px',
            border: 'solid 2px var(--f-clr-fg-200)',
            pointerEvents: 'none',
            translate: '-50% -50%'
        },

        '.wrapper[data-disabled="true"] .selection': {
            backgroundColor: 'var(--f-clr-grey-200) !important'
        },

        '.swatch': {
            width: 'auto !important',
            flexGrow: 1
        },

        '.hex ': {
            minWidth: '3.2em !important'
        },

        '.rgb': {
            display: 'flex',
            gap: 'var(--f-spacing-sml)'
        },

        '.rgb > * ': {
            minWidth: '3.2em !important',
            flexGrow: 1
        },

        '.hue__progress': {
            backgroundColor: 'transparent !important'
        },

        '.hue__track': {
            background: 'linear-gradient(90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
        },

        '.hue__handle::after': {
            boxSizing: 'border-box',
            border: 'solid 2px var(--f-clr-fg-200)'
        },

        '.hue__handle[aria-disabled="false"]::after': {
            backgroundColor: 'var(--hue) !important'
        }
    });
    const style = combineClasses(styles, cc);

    const picking = useRef(false);
    const spaceRef = useRef<HTMLDivElement>(null);

    const [partialHex, setPartialHex] = useState<string | null>(null);
    const [hsv, setHsv] = useState<color>([0, 100, 100]);
    const rgb = hsvToRgb(hsv);
    const hex = rgbToHex(rgb);

    function update(hsv: color) {
        setHsv(hsv);
        const rgb = hsvToRgb(hsv);

        onChange?.(format === 'rgb' ? rgb : rgbToHex(rgb) as any);
    }

    function pick(e: MouseEvent) {
        const { clientX, clientY } = e;

        if (!picking.current || !spaceRef.current || disabled) return;
        let { x, y, width, height } = spaceRef.current.getBoundingClientRect();

        update([
            hsv[0],
            Math.min(Math.max(clientX - x + .5, 0) / width, 1) * 100,
            (1 - Math.min(Math.max(clientY - y + .5, 0) / height, 1)) * 100
        ]);
    }

    useEffect(() => {
        const mouseup = (e: MouseEvent) => {
            pick(e);
            picking.current = false;
        }

        window.addEventListener('mouseup', mouseup);
        window.addEventListener('mousemove', pick);

        return () => {
            window.removeEventListener('mouseup', mouseup);
            window.removeEventListener('mousemove', pick);
        }
    }, [hsv, disabled]);

    useEffect(() => {
        if (!value) return;

        setHsv(typeof value === 'string' ? rgbToHsv(hexToRgb(value)) : rgbToHsv(value));
    }, [value]);

    return <div ref={ref} {...props}
        style={{
            '--hue': `hsl(${hsv[0]}, 100%, 50%)`
        } as any}
        className={classes(
            style.wrapper,
            props.className
        )}
        data-disabled={disabled}>
        <div className={style.row}>
            <div
                ref={spaceRef}
                onMouseDown={e => {
                    picking.current = true;
                    pick(e.nativeEvent);
                }}
                className={style.space}
                style={{
                    background: `linear-gradient(90deg, transparent, hsl(${hsv[0]}, 100%, 50%)), linear-gradient(white, black)`
                }}>
                <div className={style.selection} style={{
                    left: `${hsv[1]}%`,
                    top: `${100 - hsv[2]}%`,
                    backgroundColor: `rgb(${rgb.join(',')})`
                }} />
            </div>

            <div className={style.column}>
                <Swatch color={`rgb(${rgb.join(',')})`} className={style.swatch} />

                <Field
                    disabled={disabled}
                    label="Hex"
                    size="sml"
                    icon="#"
                    className={style.hex}
                    value={partialHex !== null ? partialHex : hex}
                    onChange={e => {
                        const str = e.target.value.replace(/[^\da-f]/g, '').slice(0, 6);

                        setPartialHex(str);
                        update(rgbToHsv(hexToRgb(str)));
                    }}
                    onBlur={() => setPartialHex(null)} />

                <div className={style.rgb}>
                    {rgb.map((val, i) => <NumberField
                        key={i}
                        disabled={disabled}
                        max={255}
                        precision={0}
                        controls={false}
                        label={'RGB'.charAt(i)}
                        size="sml"
                        value={val}
                        onChange={e => {
                            rgb[i] = parseInt(e.target.value) || 0;
                            update(rgbToHsv(rgb));
                        }} />)}
                </div>
            </div>
        </div>
        <Slider
            max={360}
            step={1}
            tooltips="never"
            disabled={disabled}
            value={[hsv[0]]}
            onChange={values => update([values[0], hsv[1], hsv[2]])}
            cc={{
                progress: style.hue__progress,
                track: style.hue__track,
                handle: style.hue__handle
            }} />
    </div>;
}

const ColorPicker = forwardRef(ColorPickerComponent) as (<T extends 'hex' | 'rgb' = 'hex'>(props: ColorPickerProps<T> & { ref?: React.ForwardedRef<HTMLDivElement>; }) => ReturnType<typeof ColorPickerComponent>) & { displayName: string; };

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;