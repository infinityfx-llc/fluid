'use client';

import { PopoverContent } from '../../layout/popover';
import { Animate } from '@infinityfx/lively';
import { classes, combineClasses } from '../../../../src/core/utils';
import { Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { useMenuManager } from '../../../context/menu-manager';

const styles = createStyles('action-menu-menu', {
    '.menu': {
        padding: '.25em',
        borderRadius: 'calc(.25em + var(--f-radius-sml))',
        fontSize: 'var(--f-font-size-sml)',
        minWidth: 'min(100vw, 10em)'
    },

    '.v__inverted': {
        background: 'var(--f-clr-grey-900)',
        borderColor: 'var(--f-clr-grey-800)'
    }
});

export type ActionMenuMenuSelectors = Selectors<'menu' | 'v__default' | 'v__inverted'>;

export default function Menu({ children, cc = {}, className, ...props }:
    {
        ref?: React.ForwardedRef<HTMLDivElement>;
        cc?: ActionMenuMenuSelectors;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    const { variant, initOptionsList } = useMenuManager();
    initOptionsList(false);

    return <PopoverContent role="menu">
        <Animate
            correction="none"
            key="action-menu"
            animate={{
                opacity: [0, .2, 1],
                scale: [0.9, 1],
                duration: .175
            }}
            triggers={{
                animate: ['mount', { on: 'unmount', reverse: true }]
            }}>

            <div
                {...props}
                role="group"
                data-variant={variant}
                className={classes(
                    'card',
                    'front',
                    'sd-med',
                    style.menu,
                    style[`v__${variant}`],
                    className
                )} >
                <Animate
                    inherit
                    animate={{
                        opacity: [0, 1],
                        scale: [0.95, 1],
                        duration: .175
                    }}
                    stagger={.035}>
                    {children}
                </Animate>
            </div>
        </Animate>
    </PopoverContent>;
}

Menu.displayName = 'ActionMenuMenu';