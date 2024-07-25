'use client';

import { Selectors } from '../../../src/types';
import { useState, useRef, Children, isValidElement, useEffect, cloneElement } from 'react';
import { classes, combineClasses, combineRefs } from '../../../src/core/utils';
import { createStyles } from '../../core/style';
import { Halo } from '../feedback';

const styles = createStyles('panel', {
    '.panel': {
        position: 'relative',
        display: 'flex',
        flexShrink: 0
    },

    '.d__vertical': {
        flexDirection: 'column'
    },

    '.divider': {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        touchAction: 'none'
    },

    '.d__horizontal > .divider': {
        minHeight: '100%',
        height: 'auto',
        cursor: 'ew-resize'
    },

    '.d__horizontal.v__default > .divider': {
        background: 'var(--f-clr-fg-200)',
        width: '1px'
    },

    '.d__horizontal.v__minimal > .divider': {
        paddingInline: '3px'
    },

    '.d__vertical > .divider': {
        minWidth: '100%',
        width: 'auto',
        cursor: 'ns-resize'
    },

    '.d__vertical.v__default > .divider': {
        background: 'var(--f-clr-fg-200)',
        height: '1px'
    },

    '.d__vertical.v__minimal > .divider': {
        paddingBlock: '3px'
    },

    '.focus': {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
    },

    '.d__horizontal.v__default > .divider .focus': {
        width: '3px',
        height: '100%'
    },

    '.d__vertical.v__default > .divider .focus': {
        height: '3px',
        width: '100%'
    },

    '.handle': {
        position: 'relative',
        borderRadius: '3px',
        backgroundColor: 'var(--f-clr-fg-200)',
        display: 'grid',
        gap: '1px',
        zIndex: 1,
        outline: 'none'
    },

    '.d__horizontal.v__minimal > .divider .handle': {
        width: '6px',
        height: '30px',
        backgroundColor: 'var(--f-clr-grey-200)'
    },

    '.d__vertical.v__minimal > .divider .handle': {
        height: '6px',
        width: '30px',
        backgroundColor: 'var(--f-clr-grey-200)'
    },

    '.d__horizontal > .divider .handle': {
        gridTemplateColumns: '1fr 1fr',
        padding: '5px 3px'
    },

    '.d__vertical > .divider .handle': {
        gridTemplateColumns: '1fr 1fr 1fr',
        padding: '3px 5px'
    },

    '.dot': {
        backgroundColor: 'var(--f-clr-grey-200)',
        borderRadius: '99px',
        width: '2px',
        height: '2px'
    },
    '.divider .halo': {
        inset: '-.5em'
    },
    '.v__minimal .divider .halo': {
        borderRadius: '99px'
    }
});

export type PanelSelectors = Selectors<'panel' | 'd__horizontal' | 'd__vertical' | 'divider' | 'focus' | 'handle'>;

/**
 * Resizable panels.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/panel}
 */
export default function Panel({ cc = {}, children, variant = 'default', direction = 'horizontal', handles, defaultSizes, ref, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: PanelSelectors;
        variant?: 'default' | 'minimal';
        direction?: 'horizontal' | 'vertical';
        handles?: boolean;
        defaultSizes?: number[];
        // steps??
    } & React.HTMLAttributes<HTMLElement>) {
    const style = combineClasses(styles, cc);

    const count = Children.count(children);

    const [dividers, setDividers] = useState(new Array(Math.max(count - 1, 0)).fill(0).map((_, i) => {
        return defaultSizes?.[i] !== undefined ? defaultSizes[i] : (i + 1) / count;
    }));
    const container = useRef<HTMLDivElement>(null);
    const dragging = useRef(0);

    function update(index: number, value: number) {
        const min = dividers[index - 1] || 0,
            max = dividers[index + 1] || 1;

        const updated = dividers.slice();
        updated[index] = Math.min(Math.max(value, min), max);

        setDividers(updated);
    }

    useEffect(() => {
        function drag(e: MouseEvent | TouchEvent) {
            if (!dragging.current || !container.current) return;

            const { x, y, width, height } = container.current.getBoundingClientRect();
            const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;

            const px = (clientX - x) / width, py = (clientY - y) / height;

            update(dragging.current - 1, direction === 'vertical' ? py : px);
        }

        const cancel = () => dragging.current = 0;

        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', cancel);
        window.addEventListener('touchmove', drag);
        window.addEventListener('touchend', cancel);

        return () => {
            window.removeEventListener('mousemove', drag);
            window.removeEventListener('mouseup', cancel);
            window.removeEventListener('touchmove', drag);
            window.removeEventListener('touchend', cancel);
        }
    }, [update, direction]);

    return <div
        {...props}
        ref={combineRefs(container, ref)}
        className={classes(
            style.panel,
            style[`v__${variant}`],
            style[`d__${direction}`],
            props.className
        )}>
        {Children.map(children, (child, i) => {
            if (!isValidElement(child)) return child;

            const size = (dividers[i] ?? 1) - (dividers[i - 1] ?? 0);

            return <>
                {i !== 0 && <div
                    className={style.divider}
                    onTouchStart={() => dragging.current = i}
                    onMouseDown={() => dragging.current = i}>
                    <div className={style.focus} />

                    {handles && <Halo
                        hover={false}
                        color="var(--f-clr-primary-400)"
                        cc={{
                            halo: style.halo,
                            ...cc
                        }}>
                        <div
                            tabIndex={0}
                            className={style.handle}
                            onKeyDown={e => {
                                const pos = e.key === 'ArrowRight' || e.key === 'ArrowDown';

                                if (pos || e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                                    update(i - 1, dividers[i - 1] + (pos ? 0.05 : -0.05));
                                    e.preventDefault();
                                }
                            }}>
                            {variant === 'default' && [0, 1, 2, 3, 4, 5].map(i => <div key={i} className={style.dot} />)}
                        </div>
                    </Halo>}
                </div>}

                {cloneElement(child as React.ReactElement<any>, {
                    style: {
                        ...(child as React.ReactElement<any>).props.style,
                        flexGrow: size * 100,
                        flexBasis: 0
                    }
                })}
            </>;
        })}
    </div>;
}