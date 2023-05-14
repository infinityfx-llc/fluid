import { forwardRef, useId } from 'react';
import Overlay from './overlay';
import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { Button } from '../input';
import { MdClose } from 'react-icons/md';
import { classes } from '@/src/core/utils';
import { Animatable } from '@infinityfx/lively';

const Drawer = forwardRef(({ children, styles = {}, show, onClose, position = 'right', ...props }: { children: React.ReactNode; styles?: FluidStyles; show: boolean; onClose: () => void; position?: 'left' | 'right'; } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.drawer': {
            position: 'absolute',
            background: 'var(--f-clr-bg-100)',
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--f-spacing-med)',
            width: 'clamp(0px, 16rem, 100vw)',
            border: 'solid 1px var(--f-clr-grey-100)',
            height: '100vh'
        },

        '.drawer[data-position="right"]': {
            borderTopLeftRadius: 'var(--f-radius-sml)',
            borderBottomLeftRadius: 'var(--f-radius-sml)',
            borderRight: 'none',
            right: 0
        },

        '.drawer[data-position="left"]': {
            borderTopRightRadius: 'var(--f-radius-sml)',
            borderBottomRightRadius: 'var(--f-radius-sml)',
            borderLeft: 'none',
            left: 0
        },

        '.header': {
            display: 'flex',
            marginBottom: 'var(--f-spacing-med)'
        },

        '.drawer[data-position="left"] .header': {
            justifyContent: 'flex-end'
        }
    });

    return <Overlay show={show} onClose={onClose}>
        <Animatable animate={{ translate: [`${position === 'right' ? 100 : -100}% 0%`, '0% 0%'], duration: .25 }} unmount triggers={[{ on: 'mount' }]}>
            <div ref={ref} {...props} className={classes(style.drawer, props.className)} role="dialog" aria-modal data-position={position}>
                <div className={style.header}>
                    <Button variant="minimal" onClick={onClose}>
                        <MdClose />
                    </Button>
                </div>

                {children}
            </div>
        </Animatable>
    </Overlay>;
});

Drawer.displayName = 'Drawer';

export default Drawer;