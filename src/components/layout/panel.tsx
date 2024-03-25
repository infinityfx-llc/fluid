'use client';

import { FluidStyles, Selectors } from '../../../src/types';
import { forwardRef, useState, useRef, Children, isValidElement, useEffect, cloneElement } from 'react';
import { classes, combineClasses, combineRefs } from '../../../src/core/utils';
import { createStyles } from '../../core/style';

const Panel = forwardRef(({ cc = {}, children, size, handles, vertical, ...props }:
    {
        cc?: Selectors<'navigation'>;
        size?: number;
        handles?: boolean;
        vertical?: boolean;
        // steps??
    } & React.HTMLAttributes<HTMLElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('panel', {
        '.panel': {
            position: 'relative',
            display: 'flex',
            flexShrink: 0
        },

        '.panel__vertical': {
            flexDirection: 'column'
        },

        '.divider': {
            width: '1px',
            height: '100%',
            background: 'var(--f-clr-fg-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            cursor: 'ew-resize',
            outline: 'none'
        },

        '.panel__vertical > .divider': {
            width: '100%',
            height: '1px',
            cursor: 'ns-resize'
        },

        '.focus': {
            position: 'absolute',
            width: '3px',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1
        },

        '.panel__vertical > .divider .focus': {
            width: '100%',
            height: '3px'
        },

        '.divider:focus-visible .focus': {
            backgroundColor: 'var(--f-clr-primary-100)'
        },

        '.handle': {
            position: 'absolute',
            padding: '4px',
            borderRadius: '99px',
            backgroundColor: 'var(--f-clr-fg-200)',
            zIndex: 1
        },

        '.divider:focus-visible .handle': {
            backgroundColor: 'var(--f-clr-primary-100)'
        },

        '.divider:focus-visible .strip': {
            backgroundColor: 'var(--f-clr-primary-300)'
        },

        '.strip': {
            backgroundColor: 'var(--f-clr-grey-200)',
            width: '2px',
            height: '8px',
            borderRadius: '99px'
        },

        '.panel__vertical > .divider .strip': {
            height: '2px',
            width: '8px'
        }
    });
    const style = combineClasses(styles, cc);

    const count = Children.count(children);

    const [dividers, setDividers] = useState(new Array(Math.max(count - 1, 0)).fill(0).map((_, i) => (i + 1) / count)); // init with sizes
    const container = useRef<HTMLDivElement>(null);
    const dragging = useRef(0);

    function update(index: number, value: number) {
        const min = (dividers[index - 1] || 0) + .1, max = (dividers[index + 1] || 1) - .1;

        const updated = dividers.slice();
        updated[index] = Math.min(Math.max(value, min), max);

        setDividers(updated);
    }

    useEffect(() => {
        function drag(e: MouseEvent) {
            if (!dragging.current || !container.current) return;

            const { x, y, width, height } = container.current.getBoundingClientRect();
            const { clientX, clientY } = e;

            const px = (clientX - x) / width, py = (clientY - y) / height;

            update(dragging.current - 1, vertical ? py : px);
        }

        const cancel = () => dragging.current = 0;

        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', cancel);

        return () => {
            window.removeEventListener('mousemove', drag);
            window.removeEventListener('mouseup', cancel);
        }
    }, [update, vertical]);

    return <div ref={combineRefs(container, ref)} {...props}
        className={classes(
            style.panel,
            vertical && style.panel__vertical,
            props.className
        )}
        style={{
            ...props.style,
            flexGrow: (size || 0) * 100,
            flexBasis: size ? 0 : undefined
        }}>
        {Children.map(children, (child, i) => {
            if (isValidElement(child) && child.type === Panel) return <>
                {i !== 0 && <div className={style.divider} onMouseDown={() => dragging.current = i} tabIndex={0} onKeyDown={e => {
                    const pos = e.key === 'ArrowRight' || e.key === 'ArrowDown';

                    if (pos || e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                        update(i - 1, dividers[i - 1] + (pos ? 0.05 : -0.05));
                        e.preventDefault();
                    }
                }}>
                    <div className={style.focus}>
                        {handles && <div className={style.handle}>
                            <div className={style.strip} />
                        </div>}
                    </div>
                </div>}

                {cloneElement(child, { size: (dividers[i] || 1) - (dividers[i - 1] || 0) } as any)}
            </>;

            return child;
        })}
    </div>;
});

Panel.displayName = 'Panel';

export default Panel;