'use client';

import { combineRefs } from "../../../../src/core/utils";
import { cloneElement, useRef, useEffect } from "react";
import { usePopover } from "./root";

export type PopoverTrigger = {
    children: React.ReactElement<any>;
    longpress?: boolean;
    disabled?: boolean;
} & Omit<React.HTMLAttributes<any>, 'children'>;

export default function Trigger({ children, longpress, disabled, ...props }: PopoverTrigger) {
    const { id, trigger, opened, toggle } = usePopover();
    const timeout = useRef<any>(undefined);
    const touch = useRef({ clientX: 0, clientY: 0 });
    const pressed = useRef(false);
    const touchOnly = useRef(false);
    const isDisabled = disabled || children.props.disabled;

    useEffect(() => {
        const el = trigger.current;
        if (!el) return;

        function action(delay?: number) {
            if (isDisabled) return;

            clearTimeout(timeout.current);
            delay ? timeout.current = setTimeout(action, delay) : toggle(!opened);
        }

        function start(e: MouseEvent | TouchEvent | KeyboardEvent) {
            const isTouch = 'changedTouches' in e;
            const isValidKey = 'key' in e && (e.key === 'Enter' || e.key === ' ');
            const isValidClick = 'button' in e && e.button === 0 && !touchOnly.current;

            if (isTouch) {
                touchOnly.current = true;
                touch.current = e.changedTouches[0];
            }

            if (longpress && (isValidClick || isTouch || isValidKey)) {
                pressed.current = true;
                action(400);
            }
        }

        function end(e: MouseEvent | TouchEvent | KeyboardEvent) {
            const isValidTouch = 'changedTouches' in e &&
                Math.abs(touch.current.clientX - e.changedTouches[0].clientX) + Math.abs(touch.current.clientY - e.changedTouches[0].clientY) < 8;
            const isValidKey = 'key' in e && (e.key === 'Enter' || e.key === ' ');
            const isValidClick = 'button' in e && e.button === 0 && !touchOnly.current;

            if (!longpress && (isValidClick || isValidTouch || isValidKey)) {
                action();
            }

            clearTimeout(timeout.current);
            if ('button' in e) touchOnly.current = false;
            pressed.current = false;
        }

        el.addEventListener('mousedown', start);
        el.addEventListener('mouseup', end);
        el.addEventListener('touchstart', start);
        el.addEventListener('touchend', end);
        el.addEventListener('keydown', start);
        el.addEventListener('keyup', end);

        return () => {
            el.removeEventListener('mousedown', start);
            el.removeEventListener('mouseup', end);
            el.removeEventListener('touchstart', start);
            el.removeEventListener('touchend', end);
            el.removeEventListener('keydown', start);
            el.removeEventListener('keyup', end);
        }
    }, [toggle, isDisabled, opened]);

    return cloneElement(children, {
        ...props,
        ref: combineRefs(trigger, children.props.ref),
        'aria-expanded': opened,
        'aria-controls': id,
        'aria-disabled': isDisabled
    });
}

Trigger.displayName = 'Popover.Trigger';