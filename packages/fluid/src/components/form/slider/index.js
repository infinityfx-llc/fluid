import React, { useEffect, useRef } from 'react';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';
import { addEventListener, removeEventListener } from '@core/utils';
import { Focus, Tooltip } from '@components/feedback';

export default function Slider({ children, styles, vertical, handles, min, max, step, size, disabled, error, onChange, className, ...props }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const ref = useRef();
    const progressRef = useRef();
    const handleRefs = useRef([]);
    const dragging = useRef();
    const values = useRef(new Array(handles).fill(1).map((_, i) => {
        return i / Math.max(handles - 1, 1);
    }));

    const change = (e, index = 0) => {
        const { x, width, y, height } = ref.current.getBoundingClientRect();
        set(vertical ? (e.clientY - y) / height : (e.clientX - x) / width, index);
    };

    const set = (val, index) => {
        if (disabled) return;

        val = Math.min(Math.max(val, 0), 1);
        if (index > 0) val = Math.max(val, values.current[index - 1] + step);
        if (index < handles - 1) val = Math.min(val, values.current[index + 1] - step);
        values.current[index] = Math.round(val / step) * step;

        if (is.function(onChange)) onChange(values.current.map(val => {
            return val * max + (1 - val) * min;
        }));

        update(index);
    };

    const update = (index) => {
        const size = ref.current.getBoundingClientRect()[vertical ? 'height' : 'width'];
        const axis = vertical ? 'Y' : 'X';
        handleRefs.current[index].style.transform = `translate${axis}(${values.current[index] * size - size / 2}px)`;

        const w = handles < 2 ? values.current[index] : values.current[handles - 1] - values.current[0];
        const off = handles < 2 ? 0 : values.current[0] * size;
        progressRef.current.style.transform = `translate${axis}(${off}px) scale${axis}(${w * 100}%)`;
    };

    const move = (e) => {
        if (dragging.current) change(e.touches ? e.touches[0] : e, dragging.current - 1);
    };

    const mouseup = (e) => {
        e.stopPropagation();
        dragging.current = null;
    };

    useEffect(() => {
        addEventListener('mousemove', move);
        addEventListener('touchmove', move);
        addEventListener('mouseup', mouseup);

        for (let i = 0; i < handles; i++) update(i);

        return () => {
            removeEventListener('mousemove', move);
            removeEventListener('touchmove', move);
            removeEventListener('mouseup', mouseup);
        }
    }, []);

    return <div
        {...props}
        ref={ref}
        className={combine(
            style.slider,
            style[size],
            vertical ? style.vertical : null,
            disabled ? style.disabled : null,
            error ? style.error : null,
            className
        )}
        onClick={change}>
        <div className={style.track}>
            <div className={style.progress} ref={progressRef} />
        </div>
        {new Array(handles).fill(0).map((_, i) => {
            return <Focus
                round
                key={i}
                className={style.handle_wrapper}
                ref={el => handleRefs.current[i] = el}
            >
                <Tooltip value={values.current[i].toFixed(Math.ceil(Math.log10(1 / step)))}> 
                    <div
                        className={style.handle}
                        tabIndex={0}
                        role="slider"
                        aria-disabled={disabled}
                        onMouseUp={mouseup}
                        onTouchEnd={mouseup}
                        onMouseDown={() => {
                            dragging.current = i + 1;
                        }}
                        onTouchStart={() => {
                            dragging.current = i + 1;
                        }}
                        onKeyDown={e => {
                            switch (e.key) {
                                case 'ArrowUp':
                                    set(values.current[i] + (vertical ? -step : step), i);
                                    break;
                                case 'ArrowRight':
                                    set(values.current[i] + step, i);
                                    break;
                                case 'ArrowDown':
                                    set(values.current[i] - (vertical ? -step : step), i);
                                    break;
                                case 'ArrowLeft':
                                    set(values.current[i] - step, i);
                                    break;
                                case 'Home':
                                    set(min, i);
                                    break;
                                case 'End':
                                    set(max, i);
                            }
                        }} />
                </Tooltip>
            </Focus>;
        })}
    </div>;
}

Slider.defaultProps = {
    styles: {},
    vertical: false,
    handles: 1,
    min: 0,
    max: 1,
    step: 0.05,
    size: 'med',
    disabled: false,
    error: null
};

// implement look for closest handle on click
// have work with forms
// add proper boundingbox (handles currently outside container)
// replace things like size and round with data- attributes (NOT CLASSES)