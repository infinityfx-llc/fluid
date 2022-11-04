import React, { Children, cloneElement, useRef, useState } from 'react';
import { argmax, combine, is, mergeFallback, mergeRefs } from '@core/utils';
import useStyles from '@hooks/styles';
import defaultStyles from './style';

export default function Tooltip({ children, styles, size, value }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const ref = useRef();
    const [place, setPlace] = useState('top');

    if (!Children.only(children)) return children;

    const subChildren = Children.toArray(children.props.children);
    subChildren.push(
        <div key={subChildren.length} className={style.tooltip} data-place={place}>
            {value}
        </div>
    );

    return cloneElement(children, {
        ref: mergeRefs(children.props.ref, ref),
        onMouseEnter: e => {
            if (is.function(children.props.onMouseEnter)) children.props.onMouseEnter(e);

            let { x, y, right, bottom } = ref.current.getBoundingClientRect();
            const idx = argmax([x, y, window.innerWidth - right, window.innerHeight - bottom]);
            setPlace({ 0: 'top', 1: 'left', 2: 'right', 3: 'bottom' }[idx]);
        },
        className: combine(children.props.className, style.parent)
    }, subChildren);
}

Tooltip.defaultProps = {
    styles: {},
    size: 'med',
    value: ''
};