'use client';

import Halo from '../../feedback/halo';
import { Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { classes, combineClasses, combineRefs, filterFocusable } from '../../../core/utils';
import { usePopover } from '../../layout/popover/root';
import { useRef } from 'react';

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
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xsm)',
        color: 'var(--color, var(--f-clr-text-100))',
        lineHeight: 1.25,
        WebkitTapHighlightColor: 'transparent',
        ['--halo-color' as any]: 'color-mix(in srgb, var(--color, var(--f-clr-primary-100)) 50%, var(--f-clr-text-200))'
    },

    '.item:enabled': {
        cursor: 'pointer'
    },

    '.item:disabled': {
        color: 'var(--f-clr-grey-500)'
    },
});

export type ActionMenuItemSelectors = Selectors<'item'>;

// todo: home/end/escape keys

export default function Item({ children, cc = {}, keepOpen, className, color, ...props }:
    {
        ref?: React.Ref<HTMLButtonElement>;
        cc?: ActionMenuItemSelectors;
        /**
         * Keep the ActionMenu open when clicking this entry.
         * 
         * @default false
         */
        keepOpen?: boolean;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const style = combineClasses(styles, cc);

    const ref = useRef<HTMLButtonElement>(null);
    const popover = usePopover();

    return <Halo disabled={props.disabled} color="var(--halo-color)">
        <button
            {...props}
            ref={combineRefs(props.ref, ref)}
            type="button"
            role="menuitem"
            style={{
                ...props.style,
                '--color': color
            } as any}
            className={classes(style.item, className)}
            onClick={e => {
                props.onClick?.(e);

                if (!keepOpen) popover.toggle(false);
            }}
            onKeyDown={e => {
                props.onKeyDown?.(e);
                
                let parent = ref.current?.parentElement;
                while (parent && !parent.matches('[role="menu"], [role="group"]')) parent = parent.parentElement;

                if (parent?.matches('[role="menu"]') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
                    const el = parent.parentElement?.querySelector('[aria-haspopup="menu"]') as HTMLElement;

                    if (el) {
                        e.preventDefault();
                        el.focus();
                    }
                }

                const offset = e.key === 'ArrowDown' ? 1 :
                    e.key === 'ArrowUp' ? -1 :
                        0;

                if (parent && offset !== 0) {
                    const focusable = filterFocusable(Array.from(parent.children));
                    const i = focusable.findIndex(el => el === ref.current);

                    const el = focusable[i + offset] as HTMLElement | undefined;
                    if (el) el.focus();
                    if (i >= 0) e.preventDefault();
                }
            }}>
            {children}
        </button>
    </Halo>;
}

Item.displayName = 'ActionMenu.Item';