import { forwardRef, useId } from 'react';
import Overlay from './overlay';
import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { Button } from '../input';
import { MdClose } from 'react-icons/md';
import useFluid from '@/src/hooks/use-fluid';
import { classes } from '@/src/core/utils';
import { Animatable } from '@infinityfx/lively';
import { Move } from '@infinityfx/lively/animations';

const Modal = forwardRef(({ children, styles = {}, show, onClose, title, ...props }: { children: React.ReactNode; styles?: FluidStyles; show: boolean; onClose: () => void; title?: string; } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
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
            border: 'solid 1px var(--f-clr-grey-100)',
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

        [`@media (max-width: ${fluid.breakpoints[0]}px)`]: {
            '.modal': {
                width: '100vw',
                bottom: 0,
                marginBottom: 0,
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0
            }
        }
    });

    const id = useId();

    return <Overlay show={show} onClose={onClose}>
        <Animatable animate={{ translate: ['0px 20px', '0px 0px'], opacity: [0, 1], duration: .25 }} unmount triggers={[{ on: 'mount' }]}>
            <div ref={ref} {...props} className={classes(style.modal, props.className)} role="dialog" aria-modal aria-labelledby={id}>
                <div className={style.header}>
                    <span id={id}>{title}</span>

                    <Button variant="minimal" onClick={onClose}>
                        <MdClose />
                    </Button>
                </div>

                {children}
            </div>
        </Animatable>
    </Overlay>;
});

Modal.displayName = 'Modal';

export default Modal;