'use client';

import { combineRefs } from "@/src/core/utils";
import { cloneElement, useRef } from "react";
import { usePopover } from "./root";

export type PopoverTrigger = { children: React.ReactElement; longpress?: boolean; disabled?: boolean; } & React.HTMLAttributes<any>;

export default function Trigger({ children, longpress, disabled, ...props }: PopoverTrigger) {
    const { id, trigger, opened, toggle } = usePopover();
    const timeout = useRef<any>();

    const action = () => !disabled && toggle(!opened);

    return cloneElement(children, {
        ...props,
        'aria-expanded': !!opened,
        'aria-controls': id,
        'aria-disabled': disabled,
        ref: combineRefs(trigger, (children as any).ref),
        onMouseDown: (e: React.MouseEvent) => {
            children.props.onMouseDown?.(e);
            
            clearTimeout(timeout.current);
            if (longpress) timeout.current = setTimeout(action, 400);
        },
        onTouchStart: (e: React.TouchEvent) => {
            children.props.onTouchStart?.(e);
            if (longpress) timeout.current = setTimeout(action, 400);
        },
        onMouseUp: (e: React.MouseEvent) => {
            children.props.onMouseUp?.(e);

            clearTimeout(timeout.current);
            if (!longpress) action();
        },
        onTouchEnd: (e: React.TouchEvent) => {
            e.preventDefault();
            children.props.onTouchEnd?.(e);

            clearTimeout(timeout.current);
            if (!longpress) action();
        },
        onKeyDown: (e: React.KeyboardEvent) => {
            children.props.onKeyDown?.(e);
            if (e.key !== 'Enter' && e.key !== ' ') return;

            e.preventDefault();
            if (longpress) timeout.current = setTimeout(action, 400);
        },
        onKeyUp: (e: React.KeyboardEvent) => {
            children.props.onKeyUp?.(e);
            if (e.key !== 'Enter' && e.key !== ' ') return;

            clearTimeout(timeout.current);
            if (!longpress) action();
        }
    });
}

Trigger.displayName = 'Popover.Trigger';