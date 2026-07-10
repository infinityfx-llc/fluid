'use client';

import { classes, combineClasses, combineRefs } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { useRef, useState, useId, useLayoutEffect, useCallback } from "react";
import { createStyles } from "../../core/style";

const speed = 100;

function getSizeWithoutPadding(element: HTMLElement) {
    const { padding } = getComputedStyle(element);
    const values = padding.split(' ').map(parseFloat);

    switch (values.length) {
        case 1:
            values.push(...new Array(3).fill(values[0]));
            break;
        case 2:
            values.push(...values);
            break;
        case 3:
            values.push(0);
    }

    return {
        width: element.offsetWidth - values[1] - values[3],
        height: element.offsetHeight - values[0] - values[2]
    };
}

const styles = createStyles('scrollarea', {
    '.area': {
        position: 'relative',
        overflow: 'hidden',
        outline: 'none'
    },

    '.track': {
        position: 'absolute',
        userSelect: 'none',
        zIndex: 99,
        padding: '2px',
        transition: 'opacity .2s'
    },

    '.v__permanent > .track': {
        backgroundColor: 'var(--f-clr-surface-100)'
    },

    '.v__hover > .track': {
        opacity: 0
    },

    '.v__hover:hover > .track, .area:focus-visible > .track': {
        opacity: 1
    },

    '.handle': {
        width: '.5rem',
        height: '.5rem',
        backgroundColor: 'var(--f-clr-highlight-200)',
        opacity: .35,
        borderRadius: '99px',
        transition: 'opacity .2s'
    },

    '.track:hover .handle': {
        opacity: .8
    },

    '.area:focus-visible > .track .handle': {
        opacity: .8
    },

    '.d__vertical > .track': {
        top: 0,
        right: 0,
        height: '100%'
    },

    '.d__horizontal > .track': {
        bottom: 0,
        left: 0,
        width: '100%'
    },

    '.v__permanent.d__vertical': {
        paddingRight: 'calc(.5rem + 4px)'
    },

    '.v__permanent.d__horizontal': {
        paddingBottom: 'calc(.5rem + 4px)'
    },

    '.area[data-scrollable="false"] > .track, .area[data-scroll-disabled="true"] > .track': {
        display: 'none'
    },

    '@media (pointer: coarse)': {
        '.track': {
            display: 'none'
        },

        '.area': {
            overflow: 'auto'
        }
    }
});

export type ScrollareaSelectors = Selectors<'d__vertical' | 'd__horizontal' | 'v__hover' | 'v__permanent' | 'track' | 'handle'>;

/**
 * A scrollable container.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/scrollarea}
 */
export default function Scrollarea({ children, cc = {}, direction = 'vertical', variant = 'hover', behavior = 'normal', disabled = false, ref, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: ScrollareaSelectors;
        /**
         * @default 'vertical'
         */
        direction?: 'vertical' | 'horizontal';
        /**
         * @default "hover"
         */
        variant?: 'hover' | 'permanent';
        /**
         * For `"shift"` behavior the container wil only scroll with the mouse wheel when holding the shift key.
         * 
         * @default "normal"
         */
        behavior?: 'normal' | 'shift';
        disabled?: boolean;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const horizontal = direction === 'horizontal';
    const scrolled = useRef(false);
    const lastScroll = useRef(0);

    const area = useRef<HTMLDivElement>(null);
    const track = useRef<HTMLDivElement>(null);
    const handle = useRef<HTMLDivElement>(null);
    const dragging = useRef<{ x: number; y: number; }>(null);
    const [scrollable, setScrollable] = useState(false);

    // scroll by a fixed amount based on a keyboard or scrollwheel input 
    function scroll(e: Event, delta: number) {
        const el = area.current;
        if (!el) return;

        const amount = Math.sign(delta) * speed;
        const val = el[horizontal ? 'scrollLeft' : 'scrollTop'];
        const max = el[horizontal ? 'scrollWidth' : 'scrollHeight'] - el[horizontal ? 'offsetWidth' : 'offsetHeight'];

        if ((amount > 0 ? val < max : val > 0) || e.timeStamp - lastScroll.current < 350) { // prevent overscrolling
            e.stopPropagation();
            e.preventDefault();
            lastScroll.current = e.timeStamp;
        }

        updateScrollPosition(amount);
    }

    // update scroll position based on mouse position when dragging scrollbar handle
    function drag(e: MouseEvent) {
        if (e.type === 'mouseup') return dragging.current = null;
        if (e.type === 'mousedown') {
            e.stopPropagation();
            return dragging.current = e;
        }

        const el = area.current;
        if (!el || !dragging.current) return;

        const value = horizontal ?
            (e.x - dragging.current.x) / ((1 - el.clientWidth / el.scrollWidth) * el.clientWidth) * (el.scrollWidth - el.clientWidth) :
            (e.y - dragging.current.y) / ((1 - el.clientHeight / el.scrollHeight) * el.clientHeight) * (el.scrollHeight - el.clientHeight);
        updateScrollPosition(value);

        dragging.current = e;
    }

    // update the scroll position and scrollbar handle position
    const updateScrollPosition = useCallback((value: number) => {
        const el = area.current;
        if (!el || !handle.current || !track.current || matchMedia('(pointer: coarse)').matches || disabled) return; // use default behaviour for touch based devices.

        const wKey = horizontal ? 'offsetWidth' : 'offsetHeight';
        const sKey = horizontal ? 'scrollLeft' : 'scrollTop';
        const max = Math.max(el[horizontal ? 'scrollWidth' : 'scrollHeight'] - el[wKey], 1);
        const updated = Math.max(Math.min(el[sKey] + Math.round(value), max), 0);

        if (el[sKey] !== updated) {
            el[sKey] = updated;
            scrolled.current = true;
        }

        const size = getSizeWithoutPadding(track.current)[horizontal ? 'width' : 'height']; // TODO: compute only after resize
        const offset = updated / max * (size - handle.current[wKey]);

        handle.current.style.translate = horizontal ? `${offset}px 0px` : `0px ${offset}px`;
        handle.current.setAttribute('aria-valuenow', (updated / max * 100).toString());
        track.current.style.translate = `${horizontal ? updated : el.scrollLeft}px ${horizontal ? el.scrollTop : updated}px`;
    }, [disabled, horizontal]);

    useLayoutEffect(() => {
        // update the scrollbar size based on how much the container can be scrolled
        function resize() {
            const el = area.current;
            if (!el || !handle.current || !track.current) return;

            track.current.style.translate = '0px 0px';
            handle.current.style.translate = '0px 0px';

            const size = horizontal ? el.offsetWidth / el.scrollWidth : el.offsetHeight / el.scrollHeight;
            handle.current.style[horizontal ? 'width' : 'height'] = `min(max(20px, ${size * 100}%), 100%)`;
            handle.current.style[horizontal ? 'height' : 'width'] = '';
            setScrollable(size < 1); // only show the scrollbar when the content overflows the container (there is something to scroll)

            updateScrollPosition(0);
        }

        resize();

        const observer = new ResizeObserver(resize),
            ctrl = new AbortController(),
            areaRef = area.current;
        if (!areaRef) return;

        observer.observe(areaRef);
        if (areaRef.children.length) observer.observe(areaRef.children[0]);

        areaRef.addEventListener('wheel', e => {
            if (behavior !== 'shift' || e.shiftKey) scroll(e, e.deltaY);
        }, { signal: ctrl.signal });
        window.addEventListener('mousemove', drag, { signal: ctrl.signal });
        window.addEventListener('mouseup', drag, { signal: ctrl.signal });

        return () => {
            observer.disconnect();
            ctrl.abort();
        }
    }, [scroll, horizontal, behavior]);

    return <div
        {...props}
        ref={combineRefs(ref, area)}
        id={id}
        tabIndex={0}
        className={classes(
            style.area,
            style[`v__${variant}`],
            style[`d__${direction}`],
            props.className
        )}
        onScroll={e => {
            props.onScroll?.(e);
            if (scrolled.current) return scrolled.current = false;

            updateScrollPosition(0);
        }}
        onKeyDown={e => {
            props.onKeyDown?.(e);

            if (e.key === 'ArrowDown') scroll(e.nativeEvent, 1);
            if (e.key === 'ArrowUp') scroll(e.nativeEvent, -1);
            // todo: home, end
        }}
        data-scrollable={scrollable}
        data-scroll-disabled={disabled}>
        {children}

        <div ref={track} className={style.track}>
            <div
                ref={handle}
                role="scrollbar"
                className={style.handle}
                onMouseDown={e => drag(e.nativeEvent)}
                aria-orientation={direction}
                aria-controls={id} />
        </div>
    </div>;
}