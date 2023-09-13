'use client';

import { classes, combineClasses, combineRefs } from "../../../src/core/utils";
import useDomEffect from "../../../src/hooks/use-dom-effect";
import { FluidStyles, Selectors } from "../../../src/types";
import { forwardRef, cloneElement, useState, useRef, isValidElement, useId } from "react";
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
            backgroundColor: 'var(--f-clr-grey-900)',
            color: 'var(--f-clr-text-200)',
            fontSize: 'var(--f-font-size-xsm)',
            padding: '.2em .3em',
            borderRadius: 'var(--f-radius-sml)',
            pointerEvents: 'none',
            border: 'solid 1px var(--f-clr-fg-200)'
        },

        '.tooltip[data-position="top"]': {
            translate: '-50% -100%'
        },

        '.tooltip[data-position="left"]': {
            translate: '-100% -50%'
        },

        '.tooltip[data-position="right"]': {
            translate: '0% -50%'
        },

        '.tooltip[data-position="bottom"]': {
            translate: '-50% 0%'
        }
    });
    const style = combineClasses(styles, cc);

    const id = useId();
    const anchor = useRef<HTMLDivElement | null>(null);
    const tooltip = useRef<HTMLDivElement | null>(null);
    const element = useRef<HTMLElement | null>(null);
    const [visible, setVisible] = useState(false);
    const [computed, setComputed] = useState<string>(position);

    const timeout = useRef<any>();
    function show(value: boolean, delay = 0) {
        clearTimeout(timeout.current);
        if (!element.current || !value || visibility === 'never') return setVisible(visibility === 'always');

        if (position === 'auto') {
            let { left, top, right, bottom } = element.current.getBoundingClientRect();
            right = window.innerWidth - right;
            bottom = window.innerHeight - bottom;

            const max = [[left, 'left'], [top, 'top'], [right, 'right'], [bottom, 'bottom']].sort((a: any, b: any) => b[0] - a[0])[0];

            setComputed(max[1] as string);
        }

        timeout.current = setTimeout(() => {
            setVisible(true);
        }, delay * 1000);
    }

    let frame: number;
    function update() {
        if (anchor.current && tooltip.current) {
            const { x, y } = anchor.current.getBoundingClientRect();
            tooltip.current.style.transform = `translate(${x}px, ${y}px)`;
        }

        frame = requestAnimationFrame(update);
    }

    useDomEffect(() => {
        show(visibility === 'always');
        frame = requestAnimationFrame(update);

        return () => cancelAnimationFrame(frame);
    }, [visibility]);

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

        {element.current && createPortal(<div ref={anchor} className={style.anchor} data-position={computed} />, element.current)}

        {visible && element.current && createPortal(<div ref={combineRefs(ref, tooltip)} {...props} id={id} role="tooltip" className={classes(style.tooltip, props.className)} data-position={computed}>
            {content}
        </div>, document.getElementById('__fluid') as HTMLElement)}
    </>;
});


Tooltip.displayName = 'Tooltip';

export default Tooltip;