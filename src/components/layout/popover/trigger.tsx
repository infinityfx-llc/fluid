'use client';

import { combineRefs } from "../../../../src/core/utils";
import { cloneElement, useRef } from "react";
import { usePopover } from "./root";

export type PopoverTrigger = { children: React.ReactElement; longpress?: boolean; disabled?: boolean; } & React.HTMLAttributes<any>;

export default function Trigger({ children, longpress, disabled, ...props }: PopoverTrigger) {
    const { id, trigger, opened, toggle } = usePopover();
    const timeout = useRef<any>();
    const touch = useRef({ clientX: 0, clientY: 0 });
    const pressed = useRef(false);
    const touchOnly = useRef(false);

    function action(delay?: number) {
        if (disabled || children.props.disabled) return;

        clearTimeout(timeout.current);
        delay ? timeout.current = setTimeout(action, delay) : toggle(!opened);
    }

    return cloneElement(children, {
        ...props,
        'aria-expanded': opened,
        'aria-controls': id,
        'aria-disabled': disabled,
        ref: combineRefs(trigger, (children as any).ref),
        onMouseDown: (e: React.MouseEvent) => {
            children.props.onMouseDown?.(e);
            props.onMouseDown?.(e);

            touchOnly.current = false;
            if (longpress) action(400);
        },
        onMouseUp: (e: React.MouseEvent) => {
            children.props.onMouseUp?.(e);
            props.onMouseUp?.(e);

            clearTimeout(timeout.current);
            if (!longpress && !touchOnly.current) action();
        },
        onTouchStart: (e: React.TouchEvent) => {
            children.props.onTouchStart?.(e);
            props.onTouchStart?.(e);

            touch.current = e.changedTouches[0];
            if (longpress) action(400);
        },
        onTouchEnd: (e: React.TouchEvent) => {
            children.props.onTouchEnd?.(e);
            props.onTouchEnd?.(e);

            const { clientX, clientY } = e.changedTouches[0];
            const distance = Math.abs(touch.current.clientX - clientX) + Math.abs(touch.current.clientY - clientY);

            clearTimeout(timeout.current);
            if (!longpress && distance < 8) {
                touchOnly.current = true;
                action();
            }
        },
        onKeyDown: (e: React.KeyboardEvent) => {
            children.props.onKeyDown?.(e);
            props.onKeyDown?.(e);

            if ((e.key === 'Enter' || e.key === ' ') && longpress && !pressed.current) {
                pressed.current = true;
                action(400);
            }
        },
        onKeyUp: (e: React.KeyboardEvent) => {
            children.props.onKeyUp?.(e);
            props.onKeyUp?.(e);

            pressed.current = false;
            clearTimeout(timeout.current);
            if (!longpress && (e.key === 'Enter' || e.key === ' ')) action();
        }
    });
}

Trigger.displayName = 'Popover.Trigger';