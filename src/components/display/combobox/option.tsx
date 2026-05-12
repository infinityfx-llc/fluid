'use client';

import Halo from '../../feedback/halo';
import { FluidInputvalue, Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { classes, combineClasses } from '../../../core/utils';
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

export default function Option<T extends FluidInputvalue>({ children, cc = {}, value, round, onSelect, ...props }:
    {
        ref?: React.Ref<HTMLButtonElement>;
        cc?: ComboboxOptionSelectors;
        value: T;
        round?: boolean;
        onSelect?: (value: T) => void;
    } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'>) {
    const style = combineClasses(styles, cc);

    const { variant } = usePopover();

    return <button
        {...props}
        type="button"
        role="option"
        className={classes(
            style.option,
            style[`v__${variant}`],
            round && style.round,
            props.className
        )}
        onClick={e => {
            props.onClick?.(e);
            onSelect?.(value);
        }}>
        <Halo disabled={props.disabled} color="var(--f-clr-primary-400)" />

        {children}
    </button>;
}

Option.displayName = 'Combobox.Option';