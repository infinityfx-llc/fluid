import React, { Children, cloneElement, useRef, useState } from 'react';
import { argmax, combine, is, mergeFallback, mergeRefs } from '@core/utils';
import useStyles from '@hooks/styles';
import defaultStyles from './style';

export default function Tooltip({ children, styles, size, value, place }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const ref = useRef();
    const [pos, setPos] = useState(place);

    if (!Children.only(children)) return children;

    const subChildren = Children.toArray(children.props.children);
    subChildren.push(
        <div key={subChildren.length} className={style.tooltip} data-place={pos}>
            {value}
        </div>
    );

    return cloneElement(children, {
        ref: mergeRefs(children.props.ref, ref),
        onMouseEnter: e => {
            if (is.function(children.props.onMouseEnter)) children.props.onMouseEnter(e);

            if (place) return;

            let { x, y, right, bottom } = ref.current.getBoundingClientRect();
            const idx = argmax([x, y, window.innerWidth - right, window.innerHeight - bottom]);
            setPos({ 0: 'left', 1: 'top', 2: 'right', 3: 'bottom' }[idx]);
        },
        className: combine(children.props.className, style.parent)
    }, subChildren);
}

Tooltip.defaultProps = {
    styles: {},
    size: 'med',
    value: ''
};

// always active??