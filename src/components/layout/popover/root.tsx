'use client';

import { createContext, useContext, useEffect, useId, useRef, useState, forwardRef, useImperativeHandle, useCallback } from "react";
import useFluid from "../../../hooks/use-fluid";
import useMediaQuery from "../../../hooks/use-media-query";

type PopoverContext = {
    id: string;
    mounted: boolean;
    isModal: boolean;
    trigger: React.RefObject<HTMLElement>;
    content: React.RefObject<HTMLElement>;
    opened: boolean;
    toggle: (value: boolean) => void;
    children: React.MutableRefObject<React.RefObject<HTMLElement>[]>;
};

export const PopoverContext = createContext<PopoverContext | null>(null);

export function usePopover<T extends boolean = false>(nullable?: T): T extends true ? PopoverContext | null : PopoverContext {
    const context = useContext(PopoverContext);

    if (!nullable && !context) throw new Error('Unable to access PopoverRoot context');

    return context as any;
}

export type PopoverRootReference = {
    open: () => void;
    close: () => void;
}

export type PopoverRoot = {
    children: React.ReactNode;
    position?: 'auto' | 'center';
    mobileContainer?: 'popover' | 'modal';
    stretch?: boolean;
    onClose?: () => void;
};

const Root = forwardRef(({ children, position = 'auto', mobileContainer = 'popover', stretch, onClose }: PopoverRoot, ref: React.ForwardedRef<PopoverRootReference>) => {
    const id = useId();
    const fluid = useFluid();
    const childrenRef = useRef<React.RefObject<HTMLElement>[]>([]);
    const trigger = useRef<HTMLElement>(null);
    const content = useRef<HTMLElement>(null);
    const [mounted, setMounted] = useState(false);
    const [opened, setOpened] = useState(false);
    const parent = usePopover(true);
    const isMobile = useMediaQuery(`(max-width: ${fluid.breakpoints.mob}px)`);
    const isModal = mobileContainer === 'modal' && isMobile;

    function toggle(value: boolean) {
        if (isModal) return setOpened(value);
        if (!value || !trigger.current || !content.current) return setOpened(false);

        const { x, y, right, width, height } = trigger.current.getBoundingClientRect();
        const bottom = window.innerHeight - height - y;
        const isLeft = x + width / 2 < window.innerWidth / 2;
        const isTop = y > bottom;

        content.current.style.left = (position === 'auto' ?
            isLeft ? x : right :
            x + width / 2) + 'px';
        content.current.style.transform = position === 'center' ?
            'translateX(-50%)' :
            isLeft ? '' : 'translateX(-100%)';
        content.current.style.minWidth = stretch ? `${width}px` : '';
        content.current.style[isTop ? 'bottom' : 'top'] = `calc(${isTop ? bottom + height : y + height}px + var(--f-spacing-xsm))`;
        content.current.style[isTop ? 'top' : 'bottom'] = '';

        return setOpened(value);
    }

    useImperativeHandle(ref, () => ({
        open: toggle.bind({}, true),
        close: toggle.bind({}, false)
    }), [toggle]);

    useEffect(() => {
        setMounted(true);
        const resize = () => toggle(opened);
        window.addEventListener('resize', resize);
        window.addEventListener('scroll', resize);

        if (mounted && !opened) onClose?.();
        if (!mounted && parent) parent.children.current.push(content);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('scroll', resize);
        }
    }, [opened, toggle]);

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

    return <PopoverContext.Provider value={{ id, mounted, isModal, trigger, content, opened, toggle, children: childrenRef }}>
        {children}
    </PopoverContext.Provider>;
});

Root.displayName = 'Popover.Root';

export default Root;