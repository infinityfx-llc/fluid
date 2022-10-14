import { combine, mergeFallback } from '@core/utils';
import useStyles from '@hooks/styles';
import React, { Children, cloneElement, forwardRef, useEffect, useRef } from 'react';
import defaultStyles from './style';

const Scrollbar = forwardRef(({ children, styles }, ref) => {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const innerRef = useRef();

    useEffect(() => {
        innerRef.current?.addEventListener('wheel', wheel);

        return () => innerRef.current?.removeEventListener('wheel', wheel);
    }, []);

    const wheel = (e) => {
        const el = innerRef.current;
        if (!el) return;

        const delta = e.deltaY < 0 ? -10 : 10;

        el.scrollTop += delta;
    };

    children = children.length == 1 ? children[0] : children;
    if (!Children.only(children)) return children;

    const newChildren = Children.toArray(children.props.children);
    newChildren.push(
        <div key={newChildren.length} className={style.scrollbar}>
            <div className={style.handle}></div>
        </div>
    ); // use Animatable on handle (account for top offset)

    return cloneElement(children, { ref: el => {
        'current' in ref ? ref.current = el : ref?.(el);
        innerRef.current = el;
    }, className: combine(children.props.className, style.container) }, newChildren);
});

Scrollbar.defaultProps = {
    styles: {}
};

export default Scrollbar;

// Options/TODO
// horizontal scrolling
// smooth scrolling
// drag handle with mouse
// hide custom scrollbar on mobile devices
// scroll with arrow keys
// emit scroll event maybe?
// don't scroll when scrolling inside child element
// optional global prop for scrolling whole window (use react portals maybe?)