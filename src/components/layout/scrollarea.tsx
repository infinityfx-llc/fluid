import { classes, combineRefs } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { forwardRef, useLayoutEffect, useRef, useState } from "react";

const speed = 100;

const Scrollarea = forwardRef(({ children, styles = {}, horizontal = false, variant = 'hover', disabled = false, ...props }: { styles?: FluidStyles; horizontal?: boolean; variant?: 'hover' | 'permanent'; disabled?: boolean; } & React.HTMLAttributes<HTMLDivElement>, ref: any) => {
    const style = useStyles(styles, {
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

        '.area[data-variant="hover"] .track': {
            opacity: 0
        },

        '.area[data-variant="hover"]:hover .track': {
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

        '.area[data-horizontal="false"] .track': {
            top: 0,
            right: 0,
            height: '100%'
        },

        '.area[data-horizontal="true"] .track': {
            bottom: 0,
            left: 0,
            width: '100%'
        },

        '.area[data-variant="permanent"][data-horizontal="false"] .track': {
            backgroundColor: 'var(--f-clr-fg-100)',
            paddingInline: '2px'
        },

        '.area[data-variant="permanent"][data-horizontal="true"] .track': {
            backgroundColor: 'var(--f-clr-fg-100)',
            paddingBlock: '2px'
        },

        '.area[data-variant="permanent"][data-horizontal="false"]': {
            paddingRight: 'calc(.5rem + 4px)'
        },

        '.area[data-variant="permanent"][data-horizontal="true"]': {
            paddingBottom: 'calc(.5rem + 4px)'
        },

        '.area[data-scrollable="false"] .track, .area[data-disabled="true"] .track': {
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

    const area = useRef<HTMLDivElement | null>(null);
    const track = useRef<HTMLDivElement | null>(null);
    const handle = useRef<HTMLDivElement | null>(null);
    const dragging = useRef<{ x: number; y: number; } | null>(null);
    const [scrollable, setScrollable] = useState(false);

    function wheel(e: React.WheelEvent) {
        scroll(Math.sign(e.deltaY) * speed);

        const el = area.current;
        if (!el) return;

        const val = el[horizontal ? 'scrollLeft' : 'scrollTop'];
        const max = el[horizontal ? 'scrollWidth' : 'scrollHeight'] - el[horizontal ? 'offsetWidth' : 'offsetHeight'];
        if (val > 0 && val < max) e.stopPropagation();
    }

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

    function scroll(value: number) {
        const el = area.current;
        if (!el || !handle.current || !track.current || matchMedia('(pointer: coarse)').matches || disabled) return;

        const key = horizontal ? 'offsetWidth' : 'offsetHeight';
        const max = el[horizontal ? 'scrollWidth' : 'scrollHeight'] - el[key];
        const updated = Math.max(Math.min(el[horizontal ? 'scrollLeft' : 'scrollTop'] + Math.round(value), max), 0);
        el[horizontal ? 'scrollLeft' : 'scrollTop'] = updated;

        const offset = updated / max * (el[key] - handle.current[key]);
        handle.current.style.translate = horizontal ? `${offset}px 0px` : `0px ${offset}px`;
        track.current.style.translate = horizontal ? `${updated}px 0px` : `0px ${updated}px`;
    }

    function resize() {
        const el = area.current;
        if (!el || !handle.current) return;

        const size = horizontal ? el.offsetWidth / el.scrollWidth : el.offsetHeight / el.scrollHeight;
        handle.current.style[horizontal ? 'width' : 'height'] = size * 100 + '%';
        setScrollable(size < 1);

        scroll(-Number.MAX_VALUE); // TEMP
    }

    useLayoutEffect(() => {
        resize();

        const observer = new ResizeObserver(resize);
        if (area.current) observer.observe(area.current);

        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', drag);

        return () => {
            observer.disconnect();
            window.removeEventListener('mousemove', drag);
            window.removeEventListener('mouseup', drag);
        }
    }, []);

    return <div ref={combineRefs(ref, area)} {...props} className={classes(style.area, props.className)} onWheel={wheel} data-horizontal={horizontal} data-variant={variant} data-scrollable={scrollable} data-disabled={disabled}>
        {children}

        <div ref={track} className={style.track}>
            <div ref={handle} className={style.handle} onMouseDown={e => drag(e.nativeEvent)} />
        </div>
    </div>;
});

Scrollarea.displayName = 'Scrollarea';

export default Scrollarea;