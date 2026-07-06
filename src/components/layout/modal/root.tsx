'use client';

import { useId, useRef, useEffect, createContext, use } from 'react';
import Overlay from '../overlay';
import { Selectors } from '../../../../src/types';
import { classes, combineClasses, combineRefs } from '../../../../src/core/utils';
import { Animate } from '@infinityfx/lively';
import { createStyles } from '../../../core/style';
import useFluid from '../../../hooks/use-fluid';
import useMediaQuery from '../../../hooks/use-media-query';
import { useLink } from '@infinityfx/lively/hooks';

export const ModalContext = createContext<{
    id: string;
    closeType: 'button' | 'handle';
    content: React.RefObject<HTMLDivElement | null>;
    onClose(): void;
} | null>(null);

export function useModal() {
    const context = use(ModalContext);

    if (!context) throw new Error('Unable to access ModalRoot context');

    return context;
}

const styles = createStyles('modal-root', (fluid) => ({
    '.modal': {
        background: 'var(--f-clr-surface-100)',
        borderRadius: 'var(--f-radius-lrg)',
        minWidth: 'min(100vw, 16em)',
        border: 'solid 1px var(--f-clr-surface-300)',
        margin: 'var(--f-spacing-lrg)',
        maxHeight: 'calc(100% - var(--f-spacing-lrg) * 2)',
        touchAction: 'none'
    },

    [`@media (max-width: ${fluid.breakpoints.mob}px)`]: {
        '.modal': {
            width: '100vw',
            alignSelf: 'flex-end',
            margin: 0,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            paddingBottom: '32px',
            marginBottom: '-32px'
        }
    }
}));

export type ModalRootSelectors = Selectors<'modal' | 'header' | 'handle' | 'title'>;

/**
 * Displays a container with content overlayed onto the page.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/modal}
 */
export default function Root({ children, cc = {}, show, onClose, mobileClosing = 'handle', ref, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: ModalRootSelectors;
        show: boolean;
        onClose: () => void;
        /**
         * @default "handle"
         */
        mobileClosing?: 'button' | 'handle';
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const fluid = useFluid();
    const isMobile = useMediaQuery(`(max-width: ${fluid.breakpoints.mob}px)`);
    const closeType = isMobile ? mobileClosing : 'button';

    const content = useRef<HTMLDivElement>(null);
    const modal = useRef<HTMLDivElement>(null);
    const touch = useRef<{ clientY: number; }>(null);
    const offset = useLink(0);
    const translate = useLink(offset, val => `0px ${val}px`);

    useEffect(() => {
        // animate the modal when dragging on mobile devices
        function update(e: TouchEvent) {
            if (!touch.current || !modal.current) return;

            if (!e.touches.length) {
                const py = offset.get() / modal.current.clientHeight;

                if (py > 0.35) { // close the modal when dragged below 35% the size of the modal
                    onClose();
                } else {
                    offset.set(0, { duration: .25 });
                }

                return touch.current = null;
            }

            const { clientY } = e.touches[0];
            const dy = Math.max(clientY - touch.current.clientY, -32);

            offset.set(dy, { duration: 0 });
        }

        window.addEventListener('touchmove', update);
        window.addEventListener('touchend', update);

        return () => {
            window.removeEventListener('touchmove', update);
            window.removeEventListener('touchend', update);
        }
    }, []);

    return <Overlay show={show} onClose={onClose}>
        <ModalContext value={{ id, closeType, content, onClose }}>
            <Animate
                correction="none"
                key="modal"
                onAnimationEnd={() => offset.set(0, { duration: 0 })}
                animate={{
                    translate
                }}
                clips={{
                    mob: {
                        translate: ['0% 100%', '0% 0%'],
                        duration: .25,
                        composite: 'combine'
                    },
                    dsk: {
                        opacity: [0, .2, 1],
                        scale: [0.9, 1],
                        duration: .25
                    }
                }}
                triggers={{
                    mob: isMobile ? ['mount', { on: 'unmount', reverse: true }] : [],
                    dsk: isMobile ? [] : ['mount', { on: 'unmount', reverse: true }]
                }}>
                <div
                    {...props}
                    ref={combineRefs(ref, modal)}
                    className={classes(style.modal, props.className)}
                    role="dialog"
                    aria-modal
                    aria-labelledby={id}
                    onTouchStart={e => {
                        props.onTouchStart?.(e);

                        if (closeType === 'handle' &&
                            !e.defaultPrevented &&
                            !content.current?.scrollTop &&
                            modal.current?.contains(e.target as HTMLElement)) touch.current = e.touches[0];
                    }}>
                    {children}
                </div>
            </Animate>
        </ModalContext>
    </Overlay>;
}

Root.displayName = 'ModalRoot';