import React, { forwardRef, useRef } from 'react';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';
import { combine } from '@core/utils';
import { Animatable } from '@infinityfx/lively';

const Focus = forwardRef(({ children, styles, round, size, className, onClick, ...props }, ref) => {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const focusRef = useRef();

    return <div
        {...props}
        ref={ref}
        className={combine(style.interact, style[size], className)}
        onClick={e => {
            focusRef.current.play('default', { immediate: true });
            if (is.function(onClick)) onClick(e);
        }}>
        {children}
        <div className={combine(style.focus, round ? style.round : null)}>
            <Animatable ref={focusRef} lazy={false} animate={{ duration: .3, opacity: [0, 1, 0], scale: [0, 1, 1] }}>
                <div className={style.tap} />
            </Animatable>
        </div>
    </div>;
});

Focus.defaultProps = {
    styles: {},
    round: false,
    size: 'med'
}

export default Focus;