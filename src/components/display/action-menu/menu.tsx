'use client';

import Popover from '../../layout/popover';
import { Animate } from '@infinityfx/lively';
import { classes, combineClasses } from '../../../../src/core/utils';
import { Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';

const styles = createStyles('action-menu.menu', {
    '.menu': {
        padding: '.25em',
        background: 'var(--f-clr-bg-200)',
        border: 'solid 1px var(--f-clr-fg-200)',
        borderRadius: 'calc(.25em + var(--f-radius-sml))',
        boxShadow: 'var(--f-shadow-med)',
        fontSize: 'var(--f-font-size-sml)',
        minWidth: 'min(100vw, 10em)'
    }
});

export type ActionMenuMenuSelectors = Selectors<'menu'>;

export default function Menu({ children, cc = {}, className, ...props }:
    {
        ref?: React.ForwardedRef<HTMLDivElement>;
        cc?: Selectors;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <Popover.Content role="menu">
        <Animate // look into replacing this with seperate animatable to fix Table cascade animation
            id="action-menu"
            animations={[
                {
                    opacity: [0, .2, 1],
                    scale: [0.9, 1],
                    duration: .2
                },
                {
                    opacity: [0, 1],
                    scale: [0.95, 1],
                    duration: .2
                }
            ]}
            triggers={[{ on: 'mount' }, { on: 'unmount', reverse: true }]}
            levels={2}
            stagger={.05}>

            <div {...props} className={classes(style.menu, className)} role="group">
                {children}
            </div>
        </Animate>
    </Popover.Content>;
}

Menu.displayName = 'ActionMenu.Menu';