'use client';

import { forwardRef, useId } from 'react';
import Overlay from './overlay';
import useStyles from '../../../src/hooks/use-styles';
import { FluidStyles } from '../../../src/types';
import Button from '../input/button';
import { MdClose } from 'react-icons/md';
import useFluid from '../../../src/hooks/use-fluid';
import { classes } from '../../../src/core/utils';
import { Animatable } from '@infinityfx/lively';
import Scrollarea from './scrollarea';

export type ModalStyles = FluidStyles<'.modal' | '.header'>;

const Modal = forwardRef(({ children, styles = {}, show, onClose, title, ...props }: { children: React.ReactNode; styles?: ModalStyles; show: boolean; onClose: () => void; } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const fluid = useFluid();
    const style = useStyles(styles, {
        '.modal': {
            position: 'absolute',
            background: 'var(--f-clr-bg-100)',
            borderRadius: 'var(--f-radius-med)',
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--f-spacing-med)',
            width: 'clamp(0px, 16rem, 100vw)',
            border: 'solid 1px var(--f-clr-fg-200)',
            margin: 'var(--f-spacing-lrg)'
        },

        '.header': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 700,
            marginBottom: 'var(--f-spacing-med)',
            color: 'var(--f-clr-text-100)'
        },

        [`@media (max-width: ${fluid.breakpoints.mob}px)`]: {
            '.modal': {
                width: '100vw',
                bottom: 0,
                marginBottom: 0,
                borderRadius: 'var(--f-radius-lrg)',
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0
            }
        }
    });

    const id = useId();

    return <Overlay show={show} onClose={onClose}>
        <Animatable key="modal" animate={{ translate: ['0px 20px', '0px 0px'], opacity: [0, 1], duration: .25 }} unmount triggers={[{ on: 'mount' }]}>
            <div ref={ref} {...props} className={classes(style.modal, props.className)} role="dialog" aria-modal aria-labelledby={id}>
                <div className={style.header}>
                    <span id={id}>{title}</span>

                    <Button variant="minimal" onClick={onClose}>
                        <MdClose />
                    </Button>
                </div>

                <Scrollarea>
                    {children}
                </Scrollarea>
            </div>
        </Animatable>
    </Overlay>;
});

Modal.displayName = 'Modal';

export default Modal;