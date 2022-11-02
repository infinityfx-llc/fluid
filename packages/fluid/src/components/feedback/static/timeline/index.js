import React, { Children } from 'react';
import { combine, mergeFallback } from '@core/utils';
import useStyles from '@hooks/styles';
import defaultStyles from './style';

export default function Timeline({ children, styles, uniform }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    children = Children.toArray(children);

    return <div className={style.timeline} data-uniform={uniform}>
        {children.map((child, i) => {
            return <div key={i} className={style.event}>
                <div className={style.line}>
                    <div className={style.bullet} />
                    {i < children.length - 1 && <div className={style.segment} />}
                </div>
                {child}
            </div>;
        })}
    </div>;
}

Timeline.defaultProps = {
    styles: {},
    uniform: true
};