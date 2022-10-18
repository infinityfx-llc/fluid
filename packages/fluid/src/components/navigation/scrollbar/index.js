import { addEventListener, combine, mergeFallback, removeEventListener, is } from '@core/utils';
import useStyles from '@hooks/styles';
import React, { Children, cloneElement, forwardRef, useEffect, useRef, useState } from 'react';
import defaultStyles from './style';

const Scrollbar = forwardRef(({ children, friction, styles }, ref) => {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const [hidden, setHidden] = useState(false);
    const innerRef = useRef();
    const handleRef = useRef();
    const dragging = useRef();

    const acceleration = 10 * Math.min(0.2 + friction * 8, 3);
    let velocity = 0, scrollFrame;

    const add = (value) => {
        const el = innerRef.current;
        if (!el || matchMedia('(pointer: coarse)').matches) return;

        el.scrollTop += Math.round(value);
        const offset = (1 - el.clientHeight / el.scrollHeight) * el.clientHeight * (el.scrollTop / (el.scrollHeight - el.clientHeight));
        handleRef.current.style.transform = `translateY(${el.scrollTop + offset}px)`;

        el.dispatchEvent(new Event('scroll'));
    };

    const scroll = () => {
        add(velocity);

        velocity *= 1 - friction;
        velocity = Math.abs(velocity) < 0.5 ? 0 : velocity;
        if (velocity) scrollFrame = requestAnimationFrame(scroll);
    };

    const wheel = (e) => {
        velocity += Math.sign(e.deltaY) * acceleration;

        scrollFrame = requestAnimationFrame(scroll);
    };

    const keypress = (e) => {
        if (!innerRef.current || !innerRef.current.contains(document.activeElement)) return;

        if (e.key === 'ArrowDown') velocity += acceleration;
        if (e.key === 'ArrowUp') velocity -= acceleration;

        scrollFrame = requestAnimationFrame(scroll);
    };

    const drag = (e) => {
        e = e.nativeEvent || e;
        if (e.type === 'mousedown') {
            e.stopPropagation();
            return dragging.current = e.y;
        }

        if (e.type === 'mouseup') return dragging.current = null;
        const el = innerRef.current;
        if (!el || is.null(dragging.current)) return;

        add((e.y - dragging.current) * (el.scrollHeight / (el.scrollHeight - el.clientHeight)));
        dragging.current = e.y;
    };

    const resize = () => {
        const el = innerRef.current;
        if (!el) return;

        setHidden(el.clientHeight >= el.scrollHeight);
        handleRef.current.style.height = `${el.clientHeight / el.scrollHeight * 100}%`;
    };

    useEffect(resize, [hidden]); 

    useEffect(() => {
        const resizeObserver = new ResizeObserver(resize);

        if (innerRef.current) {
            innerRef.current.addEventListener('wheel', wheel);
            resizeObserver.observe(innerRef.current);
            addEventListener('mousemove', drag);
            addEventListener('mouseup', drag);
            addEventListener('keydown', keypress);
        }

        return () => {
            innerRef.current?.removeEventListener('wheel', wheel);
            cancelAnimationFrame(scrollFrame);
            resizeObserver.disconnect();
            removeEventListener('mousemove', drag);
            removeEventListener('mouseup', drag);
            removeEventListener('keydown', keypress);
        }
    }, [innerRef]);

    children = children.length == 1 ? children[0] : children;
    if (!Children.only(children)) return children;

    const newChildren = Children.toArray(children.props.children);
    newChildren.push(
        <div key={newChildren.length} className={style.scrollbar}>
            <div ref={handleRef} className={style.handle} onMouseDown={drag}></div>
        </div>
    );

    return cloneElement(children, {
        ref: el => {
            'current' in ref ? ref.current = el : ref?.(el);
            innerRef.current = el;
        }, className: combine(children.props.className, style.container, hidden ? style.hidden : null)
    }, newChildren);
});

Scrollbar.defaultProps = {
    styles: {},
    friction: 0.1
};

export default Scrollbar;

// Options/TODO
// horizontal scrolling
// don't scroll when scrolling inside child element
// optional global prop for scrolling whole window (use react portals maybe?)