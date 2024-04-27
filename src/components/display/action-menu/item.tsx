'use client';

import { forwardRef } from 'react';
import Halo from '../../feedback/halo';
import { FluidStyles, Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { classes, combineClasses } from '../../../core/utils';
import { usePopover } from '../../layout/popover/root';

const Item = forwardRef(({ children, cc = {}, keepOpen, className, ...props }:
    {
        cc?: Selectors;
        keepOpen?: boolean;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const styles = createStyles('action-menu.item', {
        '.item': {
            position: 'relative',
            padding: '.5rem .8rem',
            border: 'none',
            background: 'none',
            outline: 'none',
            width: '100%',
            borderRadius: 'var(--f-radius-sml)',
            userSelect: 'none',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xsm)',
            color: 'var(--f-clr-text-100)'
        },

        '.item:enabled': {
            cursor: 'pointer'
        },

        '.item:disabled': {
            color: 'var(--f-clr-grey-500)'
        },
    });
    const style = combineClasses(styles, cc);

    const popover = usePopover();

    return <Halo disabled={props.disabled} color="var(--f-clr-primary-400)">
        <button ref={ref} {...props}
            className={classes(style.item, className)}
            role="menuitem"
            onClick={e => {
                props.onClick?.(e);

                if (!keepOpen) popover.toggle(false);
            }}>
            {children}
        </button>
    </Halo>;
});

Item.displayName = 'ActionMenu.Item';

export default Item;