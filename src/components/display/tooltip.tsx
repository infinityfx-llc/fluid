'use client';

import { classes, combineClasses, combineRefs } from "../../../src/core/utils";
import { FluidStyles, Selectors } from "../../../src/types";
import { forwardRef, cloneElement, useState, useRef, isValidElement, useId, useEffect } from "react";
import { createPortal } from "react-dom";
import { createStyles } from "../../core/style";

export type TooltipStyles = FluidStyles<'.tooltip'>;

const Tooltip = forwardRef(({ children, content, cc = {}, position = 'auto', visibility = 'interact', delay = .3, ...props }:
    {
        children: React.ReactElement;
        content?: React.ReactNode;
        cc?: Selectors<'tooltip'>;
        position?: 'auto' | 'top' | 'left' | 'bottom' | 'right';
        visibility?: 'never' | 'interact' | 'always';
        delay?: number;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'content'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('tooltip', {
        '.anchor': {
            position: 'absolute',
            pointerEvents: 'none'
        },

        '.anchor[data-position="top"]': {
            bottom: 'calc(100% + var(--f-spacing-sml))',
            left: '50%'
        },

        '.anchor[data-position="left"]': {
            right: 'calc(100% + var(--f-spacing-sml))',
            top: '50%'
        },

        '.anchor[data-position="right"]': {
            left: 'calc(100% + var(--f-spacing-sml))',
            top: '50%'
        },

        '.anchor[data-position="bottom"]': {
            top: 'calc(100% + var(--f-spacing-sml))',
            left: '50%'
        },

        '.tooltip': {
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 999,
            backgroundColor: 'var(--f-clr-fg-100)',
            color: 'var(--f-clr-text-100)',
            boxShadow: '0 0 8px rgb(0, 0, 0, 0.04)',
            fontSize: 'var(--f-font-size-xsm)',
            padding: '.2em .3em',
            borderRadius: 'var(--f-radius-sml)',
            pointerEvents: 'none',
            border: 'solid 1px var(--f-clr-fg-200)',
            transition: 'opacity .2s, translate .2s'
        },

        '.tooltip[aria-hidden="true"]': {
            opacity: 0,
            translate: '0px 4px'
        }
    });
    const style = combineClasses(styles, cc);

    const id = useId();
    const anchor = useRef<HTMLDivElement | null>(null);
    const tooltip = useRef<HTMLDivElement | null>(null);
    const element = useRef<HTMLElement | null>(null);
    const [visible, setVisible] = useState(false);
    const [computed, setComputed] = useState<string>(position);

    const displayPosition = position === 'auto' ? computed : position;
    const timeout = useRef<any>();
    
    function show(value: boolean, delay = 0) {
        clearTimeout(timeout.current);

        if (position === 'auto' && element.current) {
            let { left, top, right, bottom } = element.current.getBoundingClientRect();
            right = window.innerWidth - right;
            bottom = window.innerHeight - bottom;

            const max = [[left, 'left'], [top, 'top'], [right, 'right'], [bottom, 'bottom']].sort((a: any, b: any) => b[0] - a[0])[0];

            setComputed(max[1] as string);
        }

        if (!value || visibility === 'never') return setVisible(visibility === 'always');

        timeout.current = setTimeout(() => {
            setVisible(true);
        }, delay * 1000);
    }

    let frame: number;
    function update() {
        if (anchor.current && tooltip.current) {
            const { x, y } = anchor.current.getBoundingClientRect();
            let offset = '-50%, -100%';

            switch (displayPosition) {
                case 'left': offset = '-100%, -50%';
                    break;
                case 'right': offset = '0%, -50%';
                    break;
                case 'bottom': offset = '-50%, 0%';
                    break;
            }

            tooltip.current.style.transform = `translate(${x}px, ${y}px) translate(${offset})`;
        }

        frame = requestAnimationFrame(update);
    }

    useEffect(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(update);

        return () => cancelAnimationFrame(frame);
    }, [displayPosition]);

    useEffect(() => show(visibility === 'always'), [visibility]);

    children = Array.isArray(children) ? children[0] : children;
    if (!isValidElement(children)) return children;

    return <>
        {cloneElement(children as React.ReactElement, {
            'aria-describedby': id,
            ref: combineRefs(element, (children as any).ref),
            onMouseEnter: (e: React.MouseEvent) => {
                children.props.onMouseEnter?.(e);
                show(true, delay);
            },
            onMouseLeave: (e: React.MouseEvent) => {
                children.props.onMouseLeave?.(e);
                show(false);
            },
            onFocus: (e: React.FocusEvent) => {
                children.props.onFocus?.(e);
                show(true, delay);
            },
            onBlur: (e: React.FocusEvent) => {
                children.props.onBlur?.(e);
                show(false);
            }
        })}

        {element.current && createPortal(<div ref={anchor} className={style.anchor} data-position={displayPosition} />, element.current)}

        {element.current && createPortal(<div ref={combineRefs(ref, tooltip)} {...props} id={id} role="tooltip" className={classes(style.tooltip, props.className)} aria-hidden={!visible}>
            {content}
        </div>, document.getElementById('__fluid') as HTMLElement)}
    </>;
});


Tooltip.displayName = 'Tooltip';

export default Tooltip;