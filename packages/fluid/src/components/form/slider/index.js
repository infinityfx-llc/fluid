import React, { useEffect, useRef } from 'react';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';
import { addEventListener, removeEventListener } from '@core/utils';
import { Focus } from '@components/feedback';

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
        let val = vertical ? (e.pageY - y) / height : (e.pageX - x) / width;
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
        if (dragging.current) change(e, dragging.current - 1);
    };

    const mouseup = (e) => {
        e.stopPropagation();
        dragging.current = null;
    };

    useEffect(() => {
        addEventListener('mousemove', move);
        addEventListener('mouseup', mouseup);

        for (let i = 0; i < handles; i++) update(i);

        return () => {
            removeEventListener('mousemove', move);
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
        onMouseUp={change}>
        <div className={style.track}>
            <div className={style.progress} ref={progressRef} />
        </div>
        {/* <Focus> */}
        {new Array(handles).fill(0).map((_, i) => {
            return <div
                key={i}
                className={style.handle}
                ref={el => handleRefs.current[i] = el}
                tabIndex={0}
                onMouseUp={mouseup}
                onMouseDown={() => {
                    dragging.current = i + 1;
                }} />;
        })}
        {/* </Focus> */}
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

// add keyboard control
// add aria props
// implement look for closest handle on click
// tool tip on hover