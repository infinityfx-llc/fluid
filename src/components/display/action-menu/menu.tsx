'use client';

import Popover from '../../layout/popover';
import { Animate } from '@infinityfx/lively';
import { classes, combineClasses } from '../../../../src/core/utils';
import { Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { usePopover } from '../../layout/popover/root';

const styles = createStyles('action-menu.menu', {
    '.menu': {
        padding: '.25em',
        background: 'var(--f-clr-surface-100)',
        border: 'solid 1px var(--f-clr-surface-200)',
        borderRadius: 'calc(.25em + var(--f-radius-sml))',
        boxShadow: 'var(--f-shadow-med)',
        fontSize: 'var(--f-font-size-sml)',
        minWidth: 'min(100vw, 10em)'
    },

    '.v__inverted': {
        background: 'var(--f-clr-grey-900)',
        borderColor: 'var(--f-clr-grey-800)'
    }
});

export type ActionMenuMenuSelectors = Selectors<'menu'>;

export default function Menu({ children, cc = {}, className, ...props }:
    {
        ref?: React.ForwardedRef<HTMLDivElement>;
        cc?: ActionMenuMenuSelectors;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    const { variant } = usePopover();

    return <Popover.Content role="menu">
        <Animate
            correction="none"
            key="action-menu"
            animate={{
                opacity: [0, .2, 1],
                scale: [0.9, 1],
                duration: .2
            }}
            triggers={{
                animate: ['mount', { on: 'unmount', reverse: true }]
            }}
            stagger={.05}>

            <div
                {...props}
                role="group"
                className={classes(
                    style.menu,
                    style[`v__${variant}`],
                    className
                )} >
                <Animate
                    inherit
                    animate={{
                        opacity: [0, 1],
                        scale: [0.95, 1],
                        duration: .2
                    }}>
                    {children}
                </Animate>
            </div>
        </Animate>
    </Popover.Content>;
}

Menu.displayName = 'ActionMenu.Menu';