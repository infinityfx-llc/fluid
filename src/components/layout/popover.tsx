import { combineRefs } from '@/src/core/utils';
import useClickOutside from '@/src/hooks/use-click-outside';
import { LayoutGroup } from '@infinityfx/lively/layout';
import { forwardRef, cloneElement, useRef, useState, useEffect, useId, isValidElement } from 'react';
import { createPortal } from 'react-dom';

const Popover = forwardRef(<T extends React.ReactElement>({ children, content, longpress, position = 'auto', stretch, disabled, ...props }:
    {
        children: T;
        content: (close: () => void) => React.ReactElement;
        longpress?: boolean;
        position?: 'auto' | 'center';
        stretch?: boolean;
        disabled?: boolean;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'content'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const element = useRef<HTMLElement | null>(null);
    const [mounted, setMounted] = useState(false);
    const [state, setState] = useState<{ left?: string; right?: string; top?: string; bottom?: string; minWidth?: string; transform?: string; } | null>(null);

    function toggle(value: boolean) {
        if (!value || !element.current) return setState(null);

        const { x, y, right, width, height } = element.current.getBoundingClientRect();
        const bottom = window.innerHeight - height - y;
        const isLeft = x + width / 2 < window.innerWidth / 2;
        const isTop = y > bottom;
        const left = (position === 'auto' ?
            isLeft ? x : right :
            x + width / 2) + 'px';
        const transform = position === 'center' ?
            'translateX(-50%)' :
            isLeft ? undefined : 'translateX(-100%)';

        return setState({
            left,
            transform,
            [isTop ? 'bottom' : 'top']: `calc(${isTop ? bottom + height : y + height}px + var(--f-spacing-xsm))`,
            minWidth: stretch ? `${width}px` : undefined
        });
    }

    useEffect(() => {
        setMounted(true);

        const resize = () => toggle(!!state);
        window.addEventListener('resize', resize);

        return () => window.removeEventListener('resize', resize);
    }, [state]);

    const menu = useClickOutside<HTMLDivElement>(e => {
        if (element.current && !element.current.contains(e.target as HTMLElement)) setState(null);
    }, []);

    const id = useId();

    children = Array.isArray(children) ? children[0] : children;
    if (!isValidElement(children)) return children;

    return <>
        {cloneElement(children, {
            'aria-expanded': !!state,
            'aria-controls': id,
            'aria-disabled': disabled,
            ref: combineRefs(element, (children as any).ref),
            onMouseUp: (e: React.MouseEvent) => {
                children.props.onMouseUp?.(e);
                if (!disabled) toggle(!state);
            },
            onTouchEnd: (e: React.TouchEvent) => {
                e.preventDefault(); // TESTING NEEDED, TEMP HACK
                children.props.onTouchEnd?.(e);
                if (!disabled) toggle(!state);
            }
        })}

        {mounted && createPortal(<LayoutGroup adaptive={false}>
            {state && <div ref={combineRefs(menu, ref)} {...props} id={id} style={{ position: 'fixed', zIndex: 999, ...state, ...props.style }}>
                {content(() => setState(null))}
            </div>}
        </LayoutGroup>, document.body)}
    </>;
});

Popover.displayName = 'Popover';

export default Popover;

// longpress