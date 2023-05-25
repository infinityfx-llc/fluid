import { classes, combineRefs } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { forwardRef, cloneElement, useState, useRef, useLayoutEffect, isValidElement } from "react";
import { createPortal } from "react-dom";

const Tooltip = forwardRef(({ children, content, styles = {}, position = 'auto', alwaysVisible = false, delay = .3, ...props }:
    {
        children: React.ReactElement;
        content?: React.ReactNode;
        styles?: FluidStyles;
        position?: 'auto' | 'top' | 'left' | 'bottom' | 'right';
        alwaysVisible?: boolean;
        delay?: number;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'content'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
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
            backgroundColor: 'var(--f-clr-grey-800)',
            color: 'var(--f-clr-text-200)',
            fontSize: 'var(--f-font-size-xsm)',
            padding: '.2em .3em',
            borderRadius: 'var(--f-radius-sml)',
            pointerEvents: 'none'
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

    const anchor = useRef<HTMLDivElement | null>(null);
    const tooltip = useRef<HTMLDivElement | null>(null);
    const element = useRef<HTMLElement | null>(null);
    const [visible, setVisible] = useState(false);
    const [computed, setComputed] = useState<string>(position);

    let timeout: any;
    function show(value: boolean, delay = 0) {
        clearTimeout(timeout);
        if (!element.current || !value) return setVisible(alwaysVisible);

        if (position === 'auto') {
            let { left, top, right, bottom } = element.current.getBoundingClientRect();
            right = window.innerWidth - right;
            bottom = window.innerHeight - bottom;

            const max = [[left, 'left'], [top, 'top'], [right, 'right'], [bottom, 'bottom']].sort((a: any, b: any) => b[0] - a[0])[0];

            setComputed(max[1] as string);
        }

        timeout = setTimeout(() => {
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

    useLayoutEffect(() => {
        show(alwaysVisible);
        frame = requestAnimationFrame(update);

        return () => cancelAnimationFrame(frame);
    }, [alwaysVisible]);

    children = Array.isArray(children) ? children[0] : children;
    if (!isValidElement(children)) return children;

    return <>
        {cloneElement(children as React.ReactElement, {
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

        {visible && element.current && createPortal(<div ref={combineRefs(ref, tooltip)} {...props} className={classes(style.tooltip, props.className)} data-position={computed}>
            {content}
        </div>, document.body)}
    </>;
});


Tooltip.displayName = 'Tooltip';

export default Tooltip;