'use client';

import { forwardRef, useId } from 'react';
import Overlay from './overlay';
import { FluidStyles, Selectors } from '../../../src/types';
import Button from '../input/button';
import { MdClose } from 'react-icons/md';
import { classes, combineClasses } from '../../../src/core/utils';
import { Animatable } from '@infinityfx/lively';
import Scrollarea from './scrollarea';
import { createStyles } from '../../core/style';

export type ModalStyles = FluidStyles<'.modal' | '.header'>;

const Modal = forwardRef(({ children, cc = {}, show, onClose, title, ...props }:
    {
        cc?: Selectors<'modal' | 'header'>;
        show: boolean;
        onClose: () => void;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('modal', (fluid) => ({
        '.modal': {
            background: 'var(--f-clr-bg-100)',
            borderRadius: 'var(--f-radius-med)',
            display: 'flex',
            flexDirection: 'column',
            paddingBlock: 'var(--f-spacing-med)',
            width: 'clamp(0px, 16rem, 100vw)',
            border: 'solid 1px var(--f-clr-fg-200)',
            margin: 'var(--f-spacing-lrg)',
            maxHeight: 'calc(100% - var(--f-spacing-lrg) * 2)'
        },

        '.scrollarea': {
            paddingInline: 'var(--f-spacing-med)'
        },

        '.header': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 700,
            paddingInline: 'var(--f-spacing-med)',
            marginBottom: 'var(--f-spacing-med)',
            color: 'var(--f-clr-text-100)'
        },

        [`@media (max-width: ${fluid.breakpoints.mob}px)`]: {
            '.modal': {
                width: '100vw',
                alignSelf: 'flex-end',
                margin: 0,
                borderRadius: 'var(--f-radius-lrg)',
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0
            }
        }
    }));
    const style = combineClasses(styles, cc);

    const id = useId();

    return <Overlay show={show} onClose={onClose}>
        <Animatable id="modal" animate={{ translate: ['0px 20px', '0px 0px'], opacity: [0, 1], duration: .25 }} triggers={[{ on: 'mount' }, { on: 'unmount', reverse: true }]}>
            <div ref={ref} {...props} className={classes(style.modal, props.className)} role="dialog" aria-modal aria-labelledby={id}>
                <div className={style.header}>
                    <span id={id}>{title}</span>

                    <Button variant="minimal" onClick={onClose}>
                        <MdClose />
                    </Button>
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