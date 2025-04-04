'use client';

import Halo from '../../feedback/halo';
import { FluidInputvalue, Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { classes, combineClasses, combineRefs } from '../../../core/utils';
import { usePopover } from '../../layout/popover/root';
import { ComboboxContext } from './root';
import { useId, useRef } from 'react';

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

export default function Option<T extends FluidInputvalue>({ children, cc = {}, value, round, onSelect, ...props }:
    {
        ref?: React.Ref<HTMLButtonElement>;
        cc?: ComboboxOptionSelectors;
        value: T;
        round?: boolean;
        onSelect?: (value: T) => void;
    } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'>) {
    const style = combineClasses(styles, cc);
    const id = useId();

    const { query, view, selection, getIndex } = usePopover<ComboboxContext>();
    const index = getIndex(id);

    if (!('' + value).toLowerCase().includes(query) ||
        index < view.from || index > view.to) return null;

    // get round prop from parent?
    // fix autofocus
    return <Halo disabled={props.disabled} color="var(--f-clr-primary-400)">
        <button
            {...props}
            ref={combineRefs(el => {
                selection.current.list[index] = el;
            }, props.ref)}
            type="button"
            role="option"
            className={classes(
                style.option,
                round && style.round,
                props.className
            )}
            onFocus={() => selection.current.index = index}
            onClick={e => {
                props.onClick?.(e);

                onSelect?.(value);
            }}>
            {children}
        </button>
    </Halo>;
}

Option.displayName = 'Combobox.Option';