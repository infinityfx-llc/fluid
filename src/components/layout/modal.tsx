'use client';

import { forwardRef, useId, useRef, useEffect } from 'react';
import Overlay from './overlay';
import { FluidStyles, Selectors } from '../../../src/types';
import Button from '../input/button';
import { MdClose } from 'react-icons/md';
import { classes, combineClasses, combineRefs } from '../../../src/core/utils';
import { Animatable } from '@infinityfx/lively';
import Scrollarea from './scrollarea';
import { createStyles } from '../../core/style';
import useFluid from '../../hooks/use-fluid';
import useMediaQuery from '../../hooks/use-media-query';
import { useLink } from '@infinityfx/lively/hooks';

export type ModalStyles = FluidStyles<'.modal' | '.header'>;

const Modal = forwardRef(({ children, cc = {}, show, onClose, title, mobileClosing = 'handle', ...props }:
    {
        cc?: Selectors<'modal' | 'header'>;
        show: boolean;
        onClose: () => void;
        title?: React.ReactNode;
        mobileClosing?: 'button' | 'handle';
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('modal', (fluid) => ({
        '.modal': {
            background: 'var(--f-clr-bg-100)',
            borderRadius: 'var(--f-radius-med)',
            display: 'flex',
            flexDirection: 'column',
            paddingBlock: 'var(--f-spacing-med)',
            minWidth: 'clamp(0px, 16rem, 100vw)',
            border: 'solid 1px var(--f-clr-fg-200)',
            margin: 'var(--f-spacing-lrg)',
            maxHeight: 'calc(100% - var(--f-spacing-lrg) * 2)'
        },

        '.scrollarea': {
            paddingInline: 'var(--f-spacing-med)'
        },

        '.header': {
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            paddingInline: 'var(--f-spacing-med)',
            marginBottom: 'var(--f-spacing-med)',
            color: 'var(--f-clr-text-100)'
        },

        '.handle': {
            position: 'relative',
            height: '5px',
            width: '48px',
            backgroundColor: 'var(--f-clr-grey-200)',
            borderRadius: '99px',
            alignSelf: 'center',
            display: 'none',
            touchAction: 'none'
        },

        '.title': {
            flexGrow: 1
        },

        [`@media (max-width: ${fluid.breakpoints.mob}px)`]: {
            '.modal': {
                width: '100vw',
                alignSelf: 'flex-end',
                margin: 0,
                borderRadius: 'var(--f-radius-lrg)',
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0
            },

            '.handle': {
                display: 'block'
            }
        }
    }));
    const style = combineClasses(styles, cc);

    const modalRef = useRef<HTMLDivElement>(null);
    const touch = useRef<{ clientY: number; } | null>(null);
    const offset = useLink(0);

    const id = useId();
    const fluid = useFluid();
    const isMobile = useMediaQuery(`(max-width: ${fluid.breakpoints.mob}px)`);

    useEffect(() => {
        function update(e: TouchEvent) {
            if (!touch.current || !modalRef.current) return;

            if (!e.touches.length) {
                const py = offset() / modalRef.current.clientHeight;

                if (py > 0.35) {
                    onClose();
                } else {
                    offset.set(0, .25);
                }

                return touch.current = null;
            }

            const { clientY } = e.touches[0];
            const dy = Math.max(clientY - touch.current.clientY, 0);

            offset.set(dy);
        }

        window.addEventListener('touchmove', update);
        window.addEventListener('touchend', update);

        return () => {
            window.removeEventListener('touchmove', update);
            window.removeEventListener('touchend', update);
        }
    }, []);

    return <Overlay show={show} onClose={onClose}>
        <Animatable id="modal"
            onAnimationEnd={() => offset.set(0)}
            initial={isMobile ? {
                translate: '0% 100%'
            } : {
                translate: '0px 20px',
                opacity: 0
            }}
            animate={{
                translate: offset(val => `0px ${val}px`)
            }}
            animations={{
                mob: {
                    translate: ['0% 100%', '0% 0%'],
                    duration: .25,
                    composite: 'combine'
                },
                dsk: {
                    translate: ['0px 20px', '0px 0px'],
                    opacity: [0, 1],
                    duration: .25
                }
            }} triggers={[{
                on: 'mount',
                name: isMobile ? 'mob' : 'dsk'
            }, {
                on: 'unmount',
                reverse: true,
                name: isMobile ? 'mob' : 'dsk'
            }]}>
            <div ref={combineRefs(ref, modalRef)} {...props}
                className={classes(style.modal, props.className)}
                role="dialog"
                aria-modal
                aria-labelledby={id}
                onTouchStart={e => touch.current = e.touches[0]}>
                {isMobile && mobileClosing === 'handle' && <div className={style.handle} />}

                <div className={style.header}>
                    <span id={id} className={styles.title}>{title}</span>

                    {(mobileClosing === 'button' || !isMobile) && <Button compact variant="minimal" onClick={onClose}>
                        <MdClose />
                    </Button>}
                </div>

                <Scrollarea className={style.scrollarea}>
                    {children}
                </Scrollarea>
            </div>
        </Animatable>
    </Overlay>;
});

Modal.displayName = 'Modal';

export default Modal;