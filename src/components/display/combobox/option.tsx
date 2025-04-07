'use client';

import Halo from '../../feedback/halo';
import { FluidInputvalue, Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { classes, combineClasses, combineRefs } from '../../../core/utils';
import { usePopover } from '../../layout/popover/root';
import { ComboboxContext } from './root';

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
        justifyContent: 'space-between',
        lineHeight: 1.25
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

export default function Option<T extends FluidInputvalue>({ children, cc = {}, value, round, onSelect, listIndex = 0, ...props }:
    {
        ref?: React.Ref<HTMLButtonElement>;
        cc?: ComboboxOptionSelectors;
        value: T;
        round?: boolean;
        onSelect?: (value: T) => void;
        listIndex?: number;
    } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'>) {
    const style = combineClasses(styles, cc);
    const { query, view, searchable, focus } = usePopover<ComboboxContext>();

    if (!('' + value).toLowerCase().includes(query) ||
        listIndex < view.start || listIndex > view.end) return null;

    const focusIndex = listIndex + (searchable ? 1 : 0);
    
    return <Halo disabled={props.disabled} color="var(--f-clr-primary-400)">
        <button
            {...props}
            ref={combineRefs(el => {
                focus.current.list[focusIndex] = el;
            }, props.ref)}
            type="button"
            role="option"
            className={classes(
                style.option,
                round && style.round,
                props.className
            )}
            autoFocus={focusIndex == focus.current.index}
            onFocus={e => {
                focus.current.index = focusIndex;

                props.onFocus?.(e);
            }}
            onClick={e => {
                props.onClick?.(e);
                onSelect?.(value);
            }}>
            {children}
        </button>
    </Halo>;
}

Option.displayName = 'Combobox.Option';