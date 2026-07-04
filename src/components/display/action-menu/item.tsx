'use client';

import { Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { classes, combineClasses, combineRefs, filterFocusable, getFocusable } from '../../../core/utils';
import { usePopover } from '../../layout/popover/root';
import { useId, useRef } from 'react';
import Interactable from '../../feedback/interactable';
import { useMenuManager } from '../../../context/menu-manager';

const styles = createStyles('action-menu.item', {
    '.item': {
        position: 'relative',
        padding: '.5rem .8rem',
        width: '100%',
        borderRadius: 'var(--f-radius-sml)',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xsm)',
        color: 'var(--color, var(--f-clr-text-100))',
        lineHeight: 1.25,
        ['--highlight-color' as any]: 'color-mix(in srgb, var(--color, var(--f-clr-primary-100)) 50%, var(--f-clr-text-200))'
    },

    '.v__inverted': {
        color: 'var(--color, var(--f-clr-text-200))'
    },

    '.item:enabled': {
        cursor: 'pointer'
    },

    '.item:disabled': {
        color: 'var(--f-clr-grey-500)'
    },
});

export type ActionMenuItemSelectors = Selectors<'item' | 'v__default' | 'v__inverted'>;

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

    const id = useId();
    const ref = useRef<HTMLButtonElement>(null);
    const { trigger, toggle } = usePopover();
    const { variant, focus, registerOption } = useMenuManager();

    const [_, focusIndex] = registerOption(id, props.disabled ? null : ref, '');

    return <Interactable
        {...props}
        ref={combineRefs(props.ref, ref)}
        role="menuitem"
        highlightColor="var(--highlight-color)"
        autoFocus={focus.current.index === focusIndex}
        style={{
            ...props.style,
            '--color': color
        } as any}
        className={classes(
            style.item,
            style[`v__${variant}`],
            className
        )}
        onClick={e => {
            props.onClick?.(e);

            if (!keepOpen) toggle(false);
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
                const i = focusable.findIndex(el => el === ref.current) + offset;

                const el = i < 0 && parent.matches('[role="group"]') ?
                    getFocusable(trigger.current, false) :
                    focusable[Math.min(i, focusable.length - 1)] as HTMLElement | undefined;

                if (el) {
                    el.focus();
                    e.preventDefault();
                }
            }
        }}>
        {children}
    </Interactable>;
}

Item.displayName = 'ActionMenu.Item';