'use client';

import { forwardRef, useId, useRef } from 'react';
import Overlay from './overlay';
import useStyles from '../../../src/hooks/use-styles';
import { FluidStyles } from '../../../src/types';
import Button from '../input/button';
import { MdClose } from 'react-icons/md';
import { classes } from '../../../src/core/utils';
import { Animatable } from '@infinityfx/lively';
import Scrollarea from './scrollarea';

type DrawerStyles = FluidStyles<'.drawer' | '.header' | '.content'>;

const Drawer = forwardRef(({ children, styles = {}, show, onClose, position = 'right', title, ...props }: { styles?: DrawerStyles; show: boolean; onClose: () => void; position?: 'left' | 'right'; } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.drawer': {
            position: 'absolute',
            background: 'var(--f-clr-bg-100)',
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--f-spacing-med)',
            width: 'clamp(0px, 16rem, 100vw)',
            border: 'solid 1px var(--f-clr-fg-200)',
            height: '100dvh',
            top: 0
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
            justifyContent: 'space-between',
            gap: 'var(--f-spacing-sml)',
            alignItems: 'center',
            marginBottom: 'var(--f-spacing-med)',
            color: 'var(--f-clr-text-100)',
            fontWeight: 700,
        },

        '.drawer[data-position="right"] .header': {
            justifyContent: 'flex-start'
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

    const id = useId();
    const prev = useRef({ clientX: 0, clientY: 0 });

    function touch(e: React.TouchEvent) {
        if (e.type == 'touchstart') return prev.current = e.changedTouches[0];

        const dx = e.changedTouches[0].clientX - prev.current.clientX;
        const dy = Math.abs(e.changedTouches[0].clientY - prev.current.clientY);

        if ((position === 'right' ? dx > 85 : dx < -85) && Math.abs(dx) * 0.6 > dy) onClose();
    }

    return <Overlay show={show} onClose={onClose}>
        <Animatable key="drawer" animate={{ translate: [`${position === 'right' ? 100 : -100}% 0%`, '0% 0%'], duration: .25 }} unmount triggers={[{ on: 'mount' }]}>
            <div ref={ref} {...props} className={classes(style.drawer, props.className)} role="dialog" aria-modal aria-labelledby={id} data-position={position} onTouchStart={touch} onTouchMove={touch}>
                <div className={style.header}>
                    <span id={id} className={style.title}>{title}</span>

                    <Button variant="minimal" onClick={onClose}>
                        <MdClose />
                    </Button>
                </div>

                <Scrollarea className={style.content}>
                    {children}
                </Scrollarea>
            </div>
        </Animatable>
    </Overlay>;
});

Drawer.displayName = 'Drawer';

export default Drawer;