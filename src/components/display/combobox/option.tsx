'use client';

import { FluidInputvalue, Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { classes, combineClasses, combineRefs } from '../../../core/utils';
import Interactable from '../../feedback/interactable';
import { useMenuManager } from '../../../context/menu-manager';
import { useId, useRef } from 'react';
import { usePopover } from '../../layout/popover/root';

const styles = createStyles('combobox.option', {
    '.option': {
        position: 'relative',
        padding: '.5em',
        borderRadius: 'var(--f-radius-sml)',
        border: 'none',
        outline: 'none',
        background: 'none',
        width: '100%',
        color: 'var(--f-clr-text-100)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xsm)',
        lineHeight: 1.25,
        WebkitTapHighlightColor: 'transparent'
    },

    '.v__inverted': {
        color: 'var(--f-clr-text-200)'
    },

    '.option.round': {
        borderRadius: '999px'
    },

    '.option:enabled': {
        cursor: 'pointer'
    },

    '.option:disabled': {
        color: 'var(--f-clr-grey-500)'
    }
});

export type ComboboxOptionSelectors = Selectors<'option' | 'round'>;

export default function Option<T extends FluidInputvalue>({ children, cc = {}, value, disabled = false, onSelect, ...props }:
    {
        ref?: React.Ref<HTMLButtonElement>;
        cc?: ComboboxOptionSelectors;
        value: T;
        onSelect?: (value: T) => void;
    } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const ref = useRef<HTMLButtonElement>(null);
    const { isModal } = usePopover();
    const {
        round,
        variant,
        focus,
        registerOption,
    } = useMenuManager();

    const [visible, focusIndex] = registerOption(id, disabled ? null : ref, value);
    if (!visible) return null;

    return <Interactable
        {...props}
        disabled={disabled}
        role="option"
        highlightColor="var(--f-clr-primary-400)"
        ref={combineRefs(ref, props.ref)}
        className={classes(
            style.option,
            style[`v__${isModal ? 'default' : variant}`],
            round && style.round,
            props.className
        )}
        onClick={e => {
            props.onClick?.(e);
            onSelect?.(value);
        }}
        onFocus={e => {
            focus.current.index = focusIndex;

            props.onFocus?.(e);
        }}
        autoFocus={focus.current.index === focusIndex}>
        {children}
    </Interactable>;
}

Option.displayName = 'Combobox.Option';
