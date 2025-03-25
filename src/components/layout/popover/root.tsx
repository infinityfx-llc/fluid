'use client';

import { createContext, use, useEffect, useId, useRef, useState, useImperativeHandle, useLayoutEffect } from "react";
import useFluid from "../../../hooks/use-fluid";
import useMediaQuery from "../../../hooks/use-media-query";

type PopoverContext = {
    id: string;
    mounted: boolean;
    isModal: boolean;
    trigger: React.RefObject<HTMLElement | null>;
    content: React.RefObject<HTMLElement | null>;
    opened: boolean;
    toggle: (value: boolean) => void;
    children: React.RefObject<React.RefObject<HTMLElement | null>[]>;
};

export const PopoverContext = createContext<PopoverContext | null>(null);

export function usePopover<T extends boolean = false>(nullable?: T): T extends true ? PopoverContext | null : PopoverContext {
    const context = use(PopoverContext);

    if (!nullable && !context) throw new Error('Unable to access PopoverRoot context');

    return context as any;
}

export type PopoverRootReference = {
    open: () => void;
    close: () => void;
}

export type PopoverRoot = {
    children: React.ReactNode;
    ref?: React.Ref<PopoverRootReference>;
    position?: 'auto' | 'center';
    mobileContainer?: 'popover' | 'modal';
    stretch?: boolean;
    onClose?: () => void;
};

function getPosition(anchor: Element, element: Element, margin = '0px') {
    const { x, y, width, bottom } = anchor.getBoundingClientRect(),
        cx = x + width / 2,
        dy = y > window.innerHeight - bottom,
        dx = cx > window.innerWidth / 2,
        space = dx ? window.innerWidth - width - x : x;

    return {
        w: width + 'px',
        style: {
            left: !dx ? space + 'px' : 'auto',
            right: dx ? space + 'px' : 'auto',
            top: !dy ? `calc(${bottom}px + ${margin})` : 'auto',
            bottom: dy ? `calc(${window.innerHeight - y}px + ${margin})` : 'auto',
            transform: ''
        },
        centered: {
            left: cx + 'px',
            right: 'auto',
            transform: 'translateX(-50%)'
        },
        overflow: space < (element.getBoundingClientRect().width - width) / 2
    };
}

export default function Root({ children, position = 'auto', mobileContainer = 'popover', stretch, onClose, ref }: PopoverRoot) {
    const id = useId();
    const fluid = useFluid();
    const childrenRef = useRef<React.RefObject<HTMLElement>[]>([]);
    const trigger = useRef<HTMLElement>(null);
    const content = useRef<HTMLElement>(null);
    const [mounted, setMounted] = useState(false);
    const [opened, toggle] = useState(false);
    const parent = usePopover(true);
    const isModal = useMediaQuery(`(max-width: ${fluid.breakpoints.mob}px)`) &&
        mobileContainer === 'modal';

    function reposition() {
        if (isModal || !opened || !trigger.current || !content.current) return;

        const { w, style, centered, overflow } = getPosition(trigger.current, content.current, 'var(--f-spacing-xsm)');
        const shouldCenter = position === 'center' && !overflow;

        Object.assign(content.current.style, style);
        if (shouldCenter) Object.assign(content.current.style, centered);
        if (stretch) content.current.style.minWidth = w;
    }

    useLayoutEffect(reposition, [opened, stretch, isModal]);

    useImperativeHandle(ref, () => ({
        open: toggle.bind({}, true),
        close: toggle.bind({}, false)
    }), []);

    useEffect(() => {
        setMounted(true);

        window.addEventListener('resize', reposition);
        window.addEventListener('scroll', reposition);

        if (mounted && !opened) onClose?.();
        if (!mounted && parent) parent.children.current.push(content);

        return () => {
            window.removeEventListener('resize', reposition);
            window.removeEventListener('scroll', reposition);
        }
    }, [opened, parent]);

    useEffect(() => {
        function click(e: MouseEvent) {
            if (!isModal &&
                !content.current?.contains(e.target as HTMLElement) &&
                !trigger.current?.contains(e.target as HTMLElement) &&
                !childrenRef.current.some(child => child.current?.contains(e.target as HTMLElement))) toggle(false);
        }

        window.addEventListener('click', click);

        return () => window.removeEventListener('click', click);
    }, [isModal]);

    return <PopoverContext value={{ id, mounted, isModal, trigger, content, opened, toggle, children: childrenRef }}>
        {children}
    </PopoverContext>;
}

Root.displayName = 'Popover.Root';