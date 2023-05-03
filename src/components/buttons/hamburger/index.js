import React, { forwardRef, useRef, useState } from 'react';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';
import { Animatable } from '@infinityfx/lively';

const Hamburger = forwardRef(({ children, styles, size, disabled, onClick, className, ...props }, ref) => {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const layersRef = useRef();
    const crossRef = useRef();
    const [state, setState] = useState(false);

    return <button
        {...props}
        ref={ref}
        className={combine(
            style.hamburger,
            style[size],
            disabled ? style.disabled : null,
            className
        )}
        onClick={e => {
            if (!disabled && is.function(onClick)) onClick(e);
            layersRef.current.play(true, { reverse: state });
            crossRef.current.play(true, { reverse: state });

            setState(!state);
        }}>
        <div className={style.layers}>
            <Animatable ref={layersRef} lazy={false} animate={{ duration: 0.6, scale: [{ x: 1 }, { x: 0 }, { x: 0 }] }} initial={{ origin: { x: 1 } }} noDeform>
                {new Array(3).fill(0).map((_, i) => {
                    return <div key={i} className={style.layer} />;
                })}
            </Animatable>
        </div>

        <Animatable ref={crossRef}>
            <div className={style.cross}>
                <Animatable lazy={false} group={0} animate={{
                    scale: [
                        { x: 0 },
                        { set: { x: 0 }, time: .2 },
                        { x: 1 }
                    ],
                    duration: 0.6
                }} initial={{ origin: { x: 0 } }} noDeform>
                    <div className={combine(style.layer, style.hor)} />
                </Animatable>
                <Animatable lazy={false} animate={{
                    scale: [
                        { y: 0 },
                        { set: { y: 0 }, time: .2 },
                        { y: 1 }
                    ],
                    rotate: 0,
                    duration: 0.6
                }} initial={{ origin: { y: 1 } }} noDeform>
                    <div className={combine(style.layer, style.ver)} />
                </Animatable>
            </div>
        </Animatable>
    </button >;
});

Hamburger.defaultProps = {
    styles: {},
    size: 'med',
    disabled: false
};

export default Hamburger;

// Lively BUG: -90 deg rotate (probably to do with skew and rotate calc in decompose)