'use client';

import { useId, useRef, useEffect } from 'react';
import Overlay from './overlay';
import { Selectors } from '../../../src/types';
import Button from '../input/button';
import { classes, combineClasses, combineRefs } from '../../../src/core/utils';
import { Animate } from '@infinityfx/lively';
import Scrollarea from './scrollarea';
import { createStyles } from '../../core/style';
import useFluid from '../../hooks/use-fluid';
import useMediaQuery from '../../hooks/use-media-query';
import { useLink } from '@infinityfx/lively/hooks';
import { Icon } from '../../core/icons';

const styles = createStyles('modal', (fluid) => ({
    '.modal': {
        background: 'var(--f-clr-surface-100)',
        borderRadius: 'var(--f-radius-lrg)',
        minWidth: 'min(100vw, 16em)',
        border: 'solid 1px var(--f-clr-surface-300)',
        margin: 'var(--f-spacing-lrg)',
        maxHeight: 'calc(100% - var(--f-spacing-lrg) * 2)',
        touchAction: 'none'
    },

    '.content': {
        display: 'flex',
        flexDirection: 'column',
        paddingBlock: 'var(--f-spacing-med)'
    },

    '.scrollarea': {
        paddingInline: 'var(--f-spacing-med)'
    },

    '.header': {
        display: 'flex',
        alignItems: 'center',
        fontWeight: 700,
        paddingInline: 'var(--f-spacing-med)',
        paddingBottom: 'var(--f-spacing-med)',
        color: 'var(--f-clr-text-100)'
    },

    '.footer': {
        overflow: 'hidden',
        position: 'relative',
        borderTop: 'solid 1px var(--f-clr-surface-200)',
        padding: 'var(--f-spacing-med)',
        borderBottomLeftRadius: 'calc(var(--f-radius-med) - 1px)',
        borderBottomRightRadius: 'calc(var(--f-radius-med) - 1px)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--f-spacing-sml)'
    },

    '.footer::before': {
        content: '""',
        position: 'absolute',
        background: 'var(--f-clr-bg-100)',
        inset: 0,
        bottom: '-32px'
    },

    '.handle': {
        position: 'relative',
        height: '5px',
        width: '48px',
        backgroundColor: 'var(--f-clr-grey-200)',
        borderRadius: '99px',
        alignSelf: 'center',
        display: 'none'
    },

    '.title': {
        flexGrow: 1,
        color: 'var(--f-clr-heading-100)',
        paddingRight: 'var(--f-spacing-sml)'
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
        },

        '.footer': {
            overflow: 'visible'
        },

        '.handle': {
            display: 'block'
        }
    }
}));

export type ModalSelectors = Selectors<'modal' | 'header' | 'handle' | 'title'>;

/**
 * Displays a container with content overlayed onto the page.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/modal}
 */
export default function Modal({ children, cc = {}, show, onClose, title, footer, mobileClosing = 'handle', ref, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: ModalSelectors;
        show: boolean;
        onClose: () => void;
        title?: React.ReactNode;
        footer?: React.ReactNode;
        /**
         * @default "handle"
         */
        mobileClosing?: 'button' | 'handle';
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>) {
    const style = combineClasses(styles, cc);

    const content = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const touch = useRef<{ clientY: number; }>(null);
    const offset = useLink(0);
    const translate = useLink(offset, val => `0px ${val}px`);

    const id = useId();
    const fluid = useFluid();
    const isMobile = useMediaQuery(`(max-width: ${fluid.breakpoints.mob}px)`);

    useEffect(() => {
        // animate the modal when dragging on mobile devices
        function update(e: TouchEvent) {
            if (!touch.current || !modalRef.current) return;

            if (!e.touches.length) {
                const py = offset.get() / modalRef.current.clientHeight;

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
                ref={combineRefs(ref, modalRef)}
                className={classes(style.modal, props.className)}
                role="dialog"
                aria-modal
                aria-labelledby={id}
                onTouchStart={e => {
                    if (mobileClosing === 'handle' &&
                        !e.defaultPrevented &&
                        !content.current?.scrollTop &&
                        modalRef.current?.contains(e.target as HTMLElement)) touch.current = e.touches[0];
                }}>
                <div className={style.content}>
                    {isMobile && mobileClosing === 'handle' && <div className={style.handle} />}

                    <div className={style.header}>
                        <span id={id} className={style.title}>{title}</span>

                        {(mobileClosing === 'button' || !isMobile) && <Button compact variant="minimal" onClick={onClose}>
                            <Icon type="close" />
                        </Button>}
                    </div>

                    <Scrollarea className={style.scrollarea} ref={content}>
                        {children}
                    </Scrollarea>
                </div>

                {footer ? <div className={style.footer}>
                    {footer}
                </div> : null}
            </div>
        </Animate>
    </Overlay>;
}