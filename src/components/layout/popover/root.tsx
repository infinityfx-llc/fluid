'use client';

import { createContext, useContext, useEffect, useId, useRef, useState, forwardRef, useImperativeHandle, useCallback } from "react";

export const PopoverContext = createContext<{
    id: string;
    mounted: boolean;
    trigger: React.RefObject<HTMLElement>;
    opened?: { left?: string; right?: string; top?: string; bottom?: string; minWidth?: string; transform?: string; } | null;
    toggle: (value: boolean) => void;
} | null>(null);

export function usePopover() {
    const context = useContext(PopoverContext);

    if (!context) throw new Error('Unable to access PopoverRoot context');

    return context;
}

export type PopoverRootReference = {
    close: () => void;
}

const Root = forwardRef(({ children, position = 'auto', stretch, onClose }: { children: React.ReactNode; position?: 'auto' | 'center'; stretch?: boolean; onClose?: () => void; }, ref: React.ForwardedRef<PopoverRootReference>) => {
    const id = useId();
    const trigger = useRef<HTMLElement>(null);
    const [mounted, setMounted] = useState(false);
    const [opened, setOpened] = useState<{ left?: string; right?: string; top?: string; bottom?: string; minWidth?: string; transform?: string; } | null>(null);

    const toggle = useCallback((value: boolean) => {
        if (!value || !trigger.current) return setOpened(null);

        const { x, y, right, width, height } = trigger.current.getBoundingClientRect();
        const bottom = window.innerHeight - height - y;
        const isLeft = x + width / 2 < window.innerWidth / 2;
        const isTop = y > bottom;
        const left = (position === 'auto' ?
            isLeft ? x : right :
            x + width / 2) + 'px';
        const transform = position === 'center' ?
            'translateX(-50%)' :
            isLeft ? undefined : 'translateX(-100%)';

        return setOpened({
            left,
            transform,
            [isTop ? 'bottom' : 'top']: `calc(${isTop ? bottom + height : y + height}px + var(--f-spacing-xsm))`,
            minWidth: stretch ? `${width}px` : undefined
        });
    }, []);

    useImperativeHandle(ref, () => ({
        close: toggle.bind({}, false)
    }), []);

    useEffect(() => {
        setMounted(true);
        const resize = () => toggle(!!opened);
        window.addEventListener('resize', resize);

        if (mounted && !opened) onClose?.();

        return () => window.removeEventListener('resize', resize);
    }, [opened]);

    return <PopoverContext.Provider value={{ id, mounted, trigger, opened, toggle }}>
        {children}
    </PopoverContext.Provider>;
});

Root.displayName = 'Popover.Root';

export default Root;