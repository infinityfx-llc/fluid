import React, { useRef } from 'react';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';
import { combine } from '@core/utils';
import { Animatable } from '@infinityfx/lively';

export default function Focus({ children, styles, className, onClick, ...props }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const ref = useRef();

    return <div {...props} className={combine(style.container, className)} onClick={e => {
        ref.current.play('default', { immediate: true });
        if (is.function(onClick)) onClick(e);
    }}>
        {children}
        <div className={style.focus}>
            <Animatable ref={ref} lazy={false} animate={{ duration: .3, opacity: [0, 1, 0], scale: [0, 1, 1] }}>
                <div className={style.circle} />
            </Animatable>
        </div>
    </div>;
}

Focus.defaultProps = {
    styles: {}
}