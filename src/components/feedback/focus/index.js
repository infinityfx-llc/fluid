import React, { createElement, forwardRef, useRef } from 'react';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';
import { combine } from '@core/utils';
import { Animatable } from '@infinityfx/lively';

const Focus = forwardRef(({ children, styles, element, round, size, className, onClick, ...props }, ref) => {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const focusRef = useRef();

    return createElement(element, {
        ...props,
        ref,
        className: combine(style.interact, style[size], className),
        onClick: e => {
            focusRef.current.play('default', { immediate: true });
            if (is.function(onClick)) onClick(e);
        }
    }, [
        children,
        <div key={children?.length || 1} className={combine(style.focus, round ? style.round : null)}>
            <Animatable ref={focusRef} lazy={false} animate={{ duration: .3, opacity: [0, 1, 0], scale: [0, 1, 1] }}>
                <div className={style.circle} />
            </Animatable>
        </div>
    ]);
});

Focus.defaultProps = {
    styles: {},
    element: 'div',
    round: false,
    size: 'med'
}

export default Focus;

// use :active more