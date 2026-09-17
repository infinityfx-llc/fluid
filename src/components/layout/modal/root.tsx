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

function isScrollable(target: HTMLElement, boundary: HTMLElement) {
    let el: HTMLElement | null = target;
    let canScrollUp = false;
    let canScrollDown = false;

    while (el && el !== boundary) {
        if (el.scrollTop > 0) {
            canScrollUp = true;
        }

        const maxScroll = el.scrollHeight - el.clientHeight;
        if (maxScroll > 0 && el.scrollTop < maxScroll - 1) {
            const { overflowY } = getComputedStyle(el);

            if (['auto', 'scroll'].includes(overflowY)) canScrollDown = true;
        }

        el = el.parentElement;
    }

    return { canScrollUp, canScrollDown };
}

export const ModalContext = createContext<{
    id: string;
    closeType: 'button' | 'handle';
    onClose(): void;
} | null>(null);

export function useModal() {
    const context = use(ModalContext);

    if (!context) throw new Error('Unable to access ModalRoot context');

    return context;
}

const styles = createStyles('modal-root', (fluid) => ({
    '.modal': {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--f-radius-lrg)',
        minWidth: 'min(100vw, 16em)',
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

    const modal = useRef<HTMLDivElement>(null);
    const touch = useRef<{
        clientY: number;
        canScrollUp: boolean;
        canScrollDown: boolean;
    } | null>(null);
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
                    offset.set(0, { duration: .3 });
                } else {
                    offset.set(0, { duration: .3 });
                }

                return touch.current = null;
            }

            const { clientY } = e.touches[0];
            const dy = Math.max(clientY - touch.current.clientY, -32);
            if (dy < 0 && touch.current.canScrollDown) return touch.current = null;
            if (dy > 0 && touch.current.canScrollUp) return touch.current = null;

            offset.set(dy, { duration: 0 });
        }

        window.addEventListener('touchmove', update);
        window.addEventListener('touchend', update);

        return () => {
            window.removeEventListener('touchmove', update);
            window.removeEventListener('touchend', update);
        }
    }, [onClose]);

    return <Overlay show={show} onClose={onClose}>
        <ModalContext value={{ id, closeType, onClose }}>
            <Animate
                correction="none"
                key="modal"
                animate={{
                    translate
                }}
                clips={{
                    mobOpen: {
                        translate: ['0% 100%', '0% 0%'],
                        duration: .3,
                        composite: 'combine'
                    },
                    mobClose: {
                        translate: [null, '0% 100%'],
                        duration: .3,
                        composite: 'combine'
                    },
                    dsk: {
                        opacity: [0, .2, 1],
                        scale: [0.9, 1],
                        duration: .225
                    }
                }}
                triggers={{
                    mobOpen: isMobile ? ['mount'] : [],
                    mobClose: isMobile ? ['unmount'] : [],
                    dsk: isMobile ? [] : ['mount', { on: 'unmount', reverse: true }]
                }}>
                <div
                    {...props}
                    ref={combineRefs(ref, modal)}
                    className={classes(
                        'card',
                        'front',
                        style.modal,
                        props.className
                    )}
                    role="dialog"
                    aria-modal
                    aria-labelledby={id}
                    onTouchStart={e => {
                        props.onTouchStart?.(e);

                        const target = e.target as HTMLElement;

                        if (closeType !== 'handle' || e.defaultPrevented || !modal.current?.contains(target)) return;

                        // check if an element inside the modal can be scrolled, otherwise start drag animation
                        const { canScrollUp, canScrollDown } = isScrollable(target, modal.current);

                        touch.current = {
                            clientY: e.touches[0].clientY,
                            canScrollUp,
                            canScrollDown
                        };
                    }}>
                    {children}
                </div>
            </Animate>
        </ModalContext>
    </Overlay>;
}

Root.displayName = 'ModalRoot';