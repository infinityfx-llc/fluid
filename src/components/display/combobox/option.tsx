'use client';

import { FluidInputvalue, Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { classes, combineClasses, combineRefs } from '../../../core/utils';
import { usePopover } from '../../layout/popover/root';
import Interactable from '../../feedback/interactable';
import { useMenuManager } from '../../../context/menu-manager';
import { useRef } from 'react';

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

export default function Option<T extends FluidInputvalue>({ children, cc = {}, value, onSelect, ...props }:
    {
        ref?: React.Ref<HTMLButtonElement>;
        cc?: ComboboxOptionSelectors;
        value: T;
        // round?: boolean;
        onSelect?: (value: T) => void;
    } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'>) {
    const style = combineClasses(styles, cc);

    // const { variant } = usePopover();
    const index = useRef<number>(null);
    const { round, variant, focusIndex, focusList, searchQuery, virtualView, setFocus } = useMenuManager();
    const key = ('' + value).toLowerCase();

    if (!key.includes(searchQuery) ||
        (index.current !== null && (
            index.current < virtualView.from ||
            index.current > virtualView.to)
        )) return null;

    return <Interactable
        {...props}
        role="option"
        highlightColor="var(--f-clr-primary-400)"
        ref={combineRefs(el => {
            if (index.current !== null) return focusList[index.current] = el;

            index.current = focusList.push(el) - 1;
        }, props.ref)}
        className={classes(
            style.option,
            style[`v__${variant}`],
            round && style.round,
            props.className
        )}
        onClick={e => {
            props.onClick?.(e);
            onSelect?.(value);
        }}
        onFocus={e => {
            if (index.current) setFocus(index.current);

            props.onFocus?.(e);
        }}
        autoFocus={index.current === focusIndex}>
        {children}
    </Interactable>;
}

Option.displayName = 'Combobox.Option';