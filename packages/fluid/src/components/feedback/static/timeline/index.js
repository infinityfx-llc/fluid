import React, { Children } from 'react';
import { mergeFallback } from '@core/utils';
import useStyles from '@hooks/styles';
import defaultStyles from './style';

export default function Timeline({ children, styles, uniform, horizontal, progress }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    children = Children.toArray(children);

    return <div className={style.timeline} data-uniform={uniform} data-horizontal={horizontal}>
        {children.map((child, i) => {
            return <div key={i} className={style.event}>
                <div className={style.line}>
                    <div className={style.bullet} data-active={i < progress} />
                    {i < children.length - 1 && <div className={style.segment} data-active={i < progress - 1} />}
                </div>
                {child}
            </div>;
        })}
    </div>;
}

Timeline.defaultProps = {
    styles: {},
    uniform: false,
    horizontal: false,
    progress: 0
};

// maybe make animated