'use client';

import { combineRefs } from "@/src/core/utils";
import { cloneElement, isValidElement, useRef } from "react";
import { usePopover } from "./root";

export default function Trigger({ children, longpress, disabled }: { children: React.ReactElement; longpress?: boolean; disabled?: boolean; }) {
    const { id, trigger, opened, toggle } = usePopover();
    const timeout = useRef<any>();

    // children = Array.isArray(children) ? children[0] : children;
    // if (!isValidElement(children)) return children;

    const action = () => !disabled && toggle(!opened);

    return cloneElement(children, {
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
        }
    });
}

Trigger.displayName = 'Popover.Trigger';