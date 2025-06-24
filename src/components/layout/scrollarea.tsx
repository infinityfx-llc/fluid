'use client';

import { classes, combineClasses, combineRefs } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { useRef, useState, useId, useLayoutEffect } from "react";
import { createStyles } from "../../core/style";

const speed = 100;

const styles = createStyles('scrollarea', {
    '.area': {
        position: 'relative',
        overflow: 'hidden'
    },

    '.track': {
        position: 'absolute',
        userSelect: 'none',
        zIndex: 99,
        transition: 'opacity .2s'
    },

    '.v__hover > .track': {
        opacity: 0
    },

    '.v__hover:hover > .track': {
        opacity: 1
    },

    '.handle': {
        width: '.5rem',
        height: '.5rem',
        backgroundColor: 'var(--f-clr-grey-500)',
        opacity: .35,
        borderRadius: '99px',
        transition: 'opacity .2s'
    },

    '.track:hover .handle': {
        opacity: .8
    },

    '.area[data-horizontal="false"] > .track': {
        top: 0,
        right: 0,
        height: '100%'
    },

    '.area[data-horizontal="true"] > .track': {
        bottom: 0,
        left: 0,
        width: '100%'
    },

    '.v__permanent[data-horizontal="false"] > .track': {
        backgroundColor: 'var(--f-clr-fg-100)',
        paddingInline: '2px'
    },

    '.v__permanent[data-horizontal="true"] > .track': {
        backgroundColor: 'var(--f-clr-fg-100)',
        paddingBlock: '2px'
    },

    '.v__permanent[data-horizontal="false"]': {
        paddingRight: 'calc(.5rem + 4px)'
    },

    '.v__permanent[data-horizontal="true"]': {
        paddingBottom: 'calc(.5rem + 4px)'
    },

    '.area[data-scrollable="false"] > .track, .area[data-disabled="true"] > .track': {
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

export type ScrollareaSelectors = Selectors<'track' | 'v__hover' | 'v__permanent' | 'handle'>;

/**
 * A scrollable container.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/scrollarea}
 */
export default function Scrollarea({ children, cc = {}, horizontal = false, variant = 'hover', behavior = 'normal', disabled = false, ref, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: ScrollareaSelectors;
        /**
         * @default false
         */
        horizontal?: boolean;
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

    const scrolled = useRef(false);
    const lastWheel = useRef(0);

    const area = useRef<HTMLDivElement>(null);
    const track = useRef<HTMLDivElement>(null);
    const handle = useRef<HTMLDivElement>(null);
    const dragging = useRef<{ x: number; y: number; }>(null);
    const [scrollable, setScrollable] = useState(false);

    // update scroll position when using scroll wheel
    function wheel(e: WheelEvent) {
        const el = area.current;
        if (!el || (!e.shiftKey && behavior === 'shift')) return;

        const amount = Math.sign(e.deltaY) * speed;

        const val = el[horizontal ? 'scrollLeft' : 'scrollTop'];
        const max = el[horizontal ? 'scrollWidth' : 'scrollHeight'] - el[horizontal ? 'offsetWidth' : 'offsetHeight'];

        if ((amount > 0 ? val < max : val > 0) || e.timeStamp - lastWheel.current < 350) { // prevent overscrolling
            e.stopPropagation();
            e.preventDefault();
            lastWheel.current = e.timeStamp;
        }

        scroll(amount);
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
        scroll(value);

        dragging.current = e;
    }

    // update the scroll position and scrollbar handle position
    function scroll(value: number) {
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

        const offset = updated / max * (el[wKey] - handle.current[wKey]);
        handle.current.style.translate = horizontal ? `${offset}px 0px` : `0px ${offset}px`;
        handle.current.setAttribute('aria-valuenow', (updated / max * 100).toString());
        track.current.style.translate = `${horizontal ? updated : el.scrollLeft}px ${horizontal ? el.scrollTop : updated}px`;
    }

    // update the scrollbar size based on how much the container can be scrolled
    function resize() {
        const el = area.current;
        if (!el || !handle.current || !track.current) return;

        track.current.style.translate = '0px 0px';
        handle.current.style.translate = '0px 0px';
        
        const size = horizontal ? el.offsetWidth / el.scrollWidth : el.offsetHeight / el.scrollHeight;
        handle.current.style[horizontal ? 'width' : 'height'] = size * 100 + '%';
        handle.current.style[horizontal ? 'height' : 'width'] = '';
        setScrollable(size < 1); // only show the scrollbar when the content overflows the container (there is something to scroll)

        scroll(0);
    }

    useLayoutEffect(() => {
        resize();

        const observer = new ResizeObserver(resize), areaRef = area.current;
        if (!areaRef) return;

        observer.observe(areaRef);
        if (areaRef.children.length) observer.observe(areaRef.children[0]);

        areaRef.addEventListener('wheel', wheel);
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', drag);

        return () => {
            observer.disconnect();
            window.removeEventListener('mousemove', drag);
            window.removeEventListener('mouseup', drag);
            areaRef.removeEventListener('wheel', wheel);
        }
    }, [disabled, horizontal, behavior]);

    const id = useId();

    return <div
        {...props}
        ref={combineRefs(ref, area)}
        id={id}
        className={classes(
            style.area,
            style[`v__${variant}`],
            props.className
        )}
        onScroll={e => {
            props.onScroll?.(e);
            if (scrolled.current) return scrolled.current = false;

            scroll(0);
        }}
        data-horizontal={horizontal}
        data-scrollable={scrollable}
        data-disabled={disabled}>
        {children}

        <div ref={track} className={style.track}>
            <div ref={handle} className={style.handle} onMouseDown={e => drag(e.nativeEvent)} role="scrollbar" aria-controls={id} />
        </div>
    </div>;
}