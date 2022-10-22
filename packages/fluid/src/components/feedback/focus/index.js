import React, { cloneElement, useRef } from 'react';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback, mergeRefs } from '@core/utils/helper';
import { combine } from '@core/utils';
import { Animatable } from '@infinityfx/lively';

export default function Focus({ children, styles, size, className, onClick, ...props }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const ref = useRef();
    const childRef = useRef();
    const containerRef = useRef();

    return <div
        {...props}
        ref={containerRef}
        className={combine(
            style.container,
            style[size],
            className
        )}
        onClick={e => {
            ref.current.play('default', { immediate: true });
            if (is.function(onClick)) onClick(e);
            if (e.target === containerRef.current) childRef.current?.click();
        }}>
        {cloneElement(children, {
            ref: mergeRefs(children.props?.ref, childRef)
        })}
        <div className={style.focus}>
            <Animatable ref={ref} lazy={false} animate={{ duration: .3, opacity: [0, 1, 0], scale: [0, 1, 1] }}>
                <div className={style.circle} />
            </Animatable>
        </div>
    </div>;
}

Focus.defaultProps = {
    styles: {},
    size: 'med'
}