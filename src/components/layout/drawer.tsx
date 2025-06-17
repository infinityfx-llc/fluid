'use client';

import { useId, useRef } from 'react';
import Overlay from './overlay';
import { Selectors } from '../../../src/types';
import Button from '../input/button';
import { classes, combineClasses } from '../../../src/core/utils';
import { Animatable } from '@infinityfx/lively';
import Scrollarea from './scrollarea';
import { createStyles } from '../../core/style';
import { Icon } from '../../core/icons';

const styles = createStyles('drawer', {
    '.drawer': {
        position: 'absolute',
        background: 'var(--f-clr-bg-100)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--f-spacing-med)',
        width: 'min(100vw, 16em)',
        border: 'solid 1px var(--f-clr-fg-200)',
        height: '100dvh',
        top: 0,
        touchAction: 'none'
    },

    '.drawer[data-position="right"]': {
        borderTopLeftRadius: 'var(--f-radius-med)',
        borderBottomLeftRadius: 'var(--f-radius-med)',
        borderRight: 'none',
        right: 0
    },

    '.drawer[data-position="left"]': {
        borderTopRightRadius: 'var(--f-radius-med)',
        borderBottomRightRadius: 'var(--f-radius-med)',
        borderLeft: 'none',
        left: 0
    },

    '.header': {
        display: 'flex',
        gap: 'var(--f-spacing-sml)',
        alignItems: 'center',
        marginBottom: 'var(--f-spacing-med)',
        color: 'var(--f-clr-text-100)',
        fontWeight: 700,
    },

    '.title': {
        flexGrow: 1,
        color: 'var(--f-clr-heading-100)'
    },

    '.drawer[data-position="right"] .title': {
        order: 1
    },

    '.content': {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
    }
});

export type DrawerSelectors = Selectors<'drawer' | 'header' | 'title' | 'content'>;

/**
 * Displays a container with content overlayed onto the side of the page.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/drawer}
 */
export default function Drawer({ children, cc = {}, show, onClose, position = 'right', title, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: DrawerSelectors;
        show: boolean;
        onClose: () => void;
        position?: 'left' | 'right';
        title?: React.ReactNode;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const prev = useRef({ clientX: 0, clientY: 0 });

    // detect a sideward swipe to close the drawer
    function touch(e: React.TouchEvent) {
        if (e.type == 'touchstart') return prev.current = e.changedTouches[0];

        const dx = e.changedTouches[0].clientX - prev.current.clientX;
        const dy = Math.abs(e.changedTouches[0].clientY - prev.current.clientY);

        if ((position === 'right' ? dx > 85 : dx < -85) && Math.abs(dx) * 0.6 > dy) onClose();
    }

    return <Overlay show={show} onClose={onClose}>
        <Animatable id="drawer" animate={{ translate: [`${position === 'right' ? 100 : -100}% 0%`, '0% 0%'], duration: .25 }} triggers={[{ on: 'mount' }, { on: 'unmount', reverse: true }]}>
            <div {...props}
                role="dialog"
                aria-modal
                aria-labelledby={id}
                className={classes(
                    style.drawer,
                    props.className
                )}
                data-position={position}
                onTouchStart={touch}
                onTouchMove={touch}>
                <div className={style.header}>
                    <span id={id} className={style.title}>{title}</span>

                    <Button compact variant="minimal" onClick={onClose}>
                        <Icon type="close" />
                    </Button>
                </div>

                <Scrollarea className={style.content}>
                    {children}
                </Scrollarea>
            </div>
        </Animatable>
    </Overlay>;
}