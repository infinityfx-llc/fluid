import { combineRefs } from '@/src/core/utils';
import useClickOutside from '@/src/hooks/use-click-outside';
import { LayoutGroup } from '@infinityfx/lively/layout';
import { forwardRef, cloneElement, useRef, useState, useEffect, useId, isValidElement } from 'react';
import { createPortal } from 'react-dom';

const Popover = forwardRef(<T extends React.ReactElement>({ children, content, longpress, stretch, disabled, ...props }:
    {
        children: T;
        content: (close: () => void) => React.ReactElement;
        longpress?: boolean;
        stretch?: boolean;
        disabled?: boolean;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'content'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const element = useRef<HTMLElement | null>(null);
    const [mounted, setMounted] = useState(false);
    const [state, setState] = useState<{ left: string; top?: string; bottom?: string; minWidth?: string; } | null>(null);

    function toggle(value: boolean) {
        if (!value || !element.current) return setState(null);

        const { x, y, width, height } = element.current.getBoundingClientRect();
        const bottom = window.innerHeight - height - y;

        if (y > bottom) {
            return setState({
                left: x + 'px',
                bottom: `calc(${bottom + height}px + var(--f-spacing-xsm))`,
                minWidth: stretch ? `${width}px` : undefined
            });
        } else {
            return setState({
                left: x + 'px',
                top: `calc(${y + height}px + var(--f-spacing-xsm))`,
                minWidth: stretch ? `${width}px` : undefined
            });
        }
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
// right align/center (position)