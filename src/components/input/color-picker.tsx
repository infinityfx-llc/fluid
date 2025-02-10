'use client';

import { Selectors } from "../../../src/types";
import { useEffect, useRef, useState } from "react";
import { classes, combineClasses, hexToRgb, hsvToRgb, rgbToHex, rgbToHsv } from "../../../src/core/utils";
import Annotation from "../display/annotation";
import Swatch from "../display/swatch";
import { createStyles } from "../../core/style";
import Slider from "./slider";
import Field from "./field";
import NumberField from "./number-field";

// maybe sizes?

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
        userSelect: 'none',
        cursor: 'pointer',
        touchAction: 'none'
    },

    '.selection': {
        position: 'absolute',
        width: '1.2em',
        height: '1.2em',
        borderRadius: 'var(--f-radius-sml)',
        backgroundColor: 'var(--color)',
        border: 'solid 2px white',
        boxShadow: 'var(--f-shadow-sml)',
        translate: '-50% -50%',
        cursor: 'pointer',
        WebkitBackfaceVisibility: 'hidden'
    },

    '.selection[aria-disabled="true"]': {
        backgroundColor: 'var(--f-clr-grey-200)',
        borderColor: 'var(--f-clr-grey-300)'
    },

    '.wrapper .swatch': {
        width: 'auto',
        flexGrow: 1
    },

    '.wrapper .hex ': {
        minWidth: '3.2em'
    },

    '.rgb': {
        display: 'flex',
        gap: 'var(--f-spacing-sml)'
    },

    '.wrapper .rgb > * ': {
        minWidth: '3.2em',
        flexGrow: 1
    },

    '.wrapper .hue__progress': {
        backgroundColor: 'transparent'
    },

    '.hue__track': {
        background: 'linear-gradient(90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
        height: '100%',
        borderRadius: 'var(--f-radius-sml)'
    },

    '.wrapper .hue__handle': {
        borderRadius: 'var(--f-radius-med)'
    },

    '.hue__handle::after': {
        boxSizing: 'border-box',
        border: 'solid 2px white',
        borderRadius: 'var(--f-radius-sml)'
    },

    '.hue__handle[aria-disabled="true"]::after': {
        borderColor: 'var(--f-clr-grey-300)'
    },

    '.wrapper .hue__handle[aria-disabled="false"]::after': {
        backgroundColor: 'var(--hue)'
    }
});

export type ColorPickerSelectors = Selectors<'wrapper'>;

type RGB = [number, number, number];
type HSV = [number, number, number];

type ColorPickerProps<T> = {
    ref?: React.Ref<HTMLDivElement>;
    cc?: Selectors<'wrapper'>;
    format?: T;
    value?: T extends 'hex' ? string : RGB;
    defaultValue?: T extends 'hex' ? string : RGB;
    onChange?: (value: T extends 'hex' ? string : RGB) => void;
    disabled?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'children' | 'onChange'>;

function rgbEqualsHsv(rgb: RGB, hsv: HSV) {
    const [r, g, b] = hsvToRgb(hsv);

    return r == rgb[0] && g == rgb[1] && b == rgb[2];
}

/**
 * An input used for picking a color.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/color-picker}
 */
export default function ColorPicker<T extends 'hex' | 'rgb' = 'hex'>({ cc = {}, format, defaultValue, value, onChange, disabled, ...props }: ColorPickerProps<T>) {
    const style = combineClasses(styles, cc);

    const picking = useRef(false);
    const spaceRef = useRef<HTMLDivElement>(null);

    const rgbValue = value === undefined ?
        null :
        typeof value === 'string' ?
            hexToRgb(value) :
            value as RGB;
    const initial = defaultValue === undefined ?
        [255, 0, 0] as RGB :
        typeof defaultValue === 'string' ?
            hexToRgb(defaultValue) :
            defaultValue as RGB;

    const [color, setColor] = useState<HSV>(rgbToHsv(initial));
    const [partialHex, setPartialHex] = useState<string | null>(null);
    const [rgb, setRgb] = rgbValue ? [rgbValue] : useState<RGB>(initial);
    const hsv = rgbEqualsHsv(rgb, color) ? color : rgbToHsv(rgb);
    const mutableColor = useRef(hsv);

    function update(rgb: RGB, mutate = false) {
        setRgb?.(rgb);
        onChange?.(format === 'rgb' ? rgb : rgbToHex(rgb) as any);

        if (mutate) mutableColor.current = rgbToHsv(rgb);
        setColor(mutableColor.current);
    }

    // pick color from color space based on mouse position
    function pick(e: MouseEvent | TouchEvent) {
        if (!picking.current || !spaceRef.current || disabled) return;

        const { clientX, clientY } = 'touches' in e ? e.changedTouches[0] : e;
        let { x, y, width, height } = spaceRef.current.getBoundingClientRect();

        mutableColor.current[1] = Math.min(Math.max(clientX - x + .5, 0) / width, 1) * 100;
        mutableColor.current[2] = (1 - Math.min(Math.max(clientY - y + .5, 0) / height, 1)) * 100;

        update(hsvToRgb(mutableColor.current));
    }

    useEffect(() => {
        const ctrl = new AbortController(),
            signal = ctrl.signal;

        const end = (e: MouseEvent | TouchEvent) => {
            pick(e);
            picking.current = false;
        };

        window.addEventListener('mouseup', end, { signal });
        window.addEventListener('touchend', end, { signal });
        window.addEventListener('mousemove', pick, { signal });
        window.addEventListener('touchmove', pick, { signal });

        return () => ctrl.abort();
    }, [disabled]);

    return <div {...props}
        style={{
            '--hue': `hsl(${hsv[0]}, 100%, 50%)`,
            '--color': `rgb(${rgb.join(',')})`
        } as any}
        className={classes(
            style.wrapper,
            props.className
        )}>
        <div className={style.row}>
            <div
                ref={spaceRef}
                onMouseDown={e => {
                    picking.current = true;
                    pick(e.nativeEvent);
                }}
                onTouchStart={e => {
                    picking.current = true;
                    pick(e.nativeEvent);
                }}
                className={style.space}
                style={{
                    background: `linear-gradient(90deg, transparent, hsl(${hsv[0]}, 100%, 50%)), linear-gradient(white, black)`
                }}>
                <div
                    aria-disabled={disabled}
                    className={style.selection}
                    style={{
                        left: `${hsv[1]}%`,
                        top: `${100 - hsv[2]}%`
                    }} />
            </div>

            <div className={style.column}>
                <Swatch color={`rgb(${rgb.join(',')})`} cc={{ swatch: style.swatch, ...cc }} />

                <Annotation label="Hex">
                    <Field
                        disabled={disabled}
                        size="sml"
                        icon="#"
                        className={style.hex}
                        value={partialHex !== null ? partialHex : rgbToHex(rgb)}
                        onChange={e => {
                            const str = e.target.value.replace(/[^\da-fA-F]/g, '').slice(0, 6);

                            setPartialHex(str);
                            update(hexToRgb(str), true);
                        }}
                        onBlur={() => setPartialHex(null)} />
                </Annotation>

                <div className={style.rgb}>
                    {rgb.map((val, i) => <Annotation key={i} label={'RGB'.charAt(i)}>
                        <NumberField
                            cc={cc}
                            disabled={disabled}
                            max={255}
                            precision={0}
                            controls={false}
                            size="sml"
                            value={val}
                            onChange={e => {
                                const updated = rgb.slice() as RGB;
                                updated[i] = parseInt(e.target.value) || 0;

                                update(updated, true);
                            }} />
                    </Annotation>)}
                </div>
            </div>
        </div>
        <Slider
            max={360}
            step={.25}
            tooltips="never"
            disabled={disabled}
            value={[hsv[0]]}
            onChange={values => {
                mutableColor.current[0] = values[0];

                update(hsvToRgb(mutableColor.current));
            }}
            cc={{
                progress: style.hue__progress,
                track: style.hue__track,
                handle: style.hue__handle,
                ...cc
            }} />
    </div>;
}