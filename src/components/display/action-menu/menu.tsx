'use client';

import { forwardRef } from 'react';
import Popover from '../../layout/popover';
import { Animate } from '@infinityfx/lively';
import { Move, Pop } from '@infinityfx/lively/animations';
import { classes, combineClasses } from '../../../../src/core/utils';
import { Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';

const styles = createStyles('action-menu.menu', {
    '.menu': {
        padding: '.25em',
        background: 'var(--f-clr-fg-100)',
        border: 'solid 1px var(--f-clr-fg-200)',
        borderRadius: 'calc(.25em + var(--f-radius-sml))',
        boxShadow: 'var(--f-shadow-med)',
        fontSize: 'var(--f-font-size-sml)',
        minWidth: 'min(100vw, 10em)',
        width: '100%'
    },
});

export type ActionMenuMenuSelectors = Selectors<'menu'>;

const Menu = forwardRef(({ children, cc = {}, className, ...props }:
    {
        cc?: Selectors;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = combineClasses(styles, cc);

    return <Popover.Content role="menu">
        <Animate id="action-menu"
            animations={[Move.unique({ duration: .2 }), Pop.unique({ duration: .2 })]}
            triggers={[{ on: 'mount' }, { on: 'unmount', reverse: true }]}
            levels={2}
            stagger={.06}>

            <div ref={ref} {...props} className={classes(style.menu, className)} role="group">
                {children}
            </div>
        </Animate>
    </Popover.Content>;
});

Menu.displayName = 'ActionMenu.Menu';

export default Menu;