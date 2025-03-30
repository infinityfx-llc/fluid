'use client';

import { Children, useState, isValidElement, useRef, cloneElement } from 'react';
import Popover from '../../layout/popover';
import Scrollarea from '../../layout/scrollarea';
import Field from '../../input/field';
import { Animatable } from '@infinityfx/lively';
import { classes, combineClasses, getFocusable } from '../../../../src/core/utils';
import { FluidSize, Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { usePopover } from '../../layout/popover/root';
import { Icon } from '../../../core/icons';

const styles = createStyles('combobox.content', {
    '.container': {
        background: 'var(--f-clr-fg-100)',
        border: 'solid 1px var(--f-clr-fg-200)',
        borderRadius: 'calc(.25em + var(--f-radius-sml))',
        boxShadow: 'var(--f-shadow-med)',
        minWidth: 'min(100vw, 10em)',
        width: '100%'
    },

    '.container.round': {
        borderRadius: '1.4em'
    },

    '.s__xsm': {
        fontSize: 'var(--f-font-size-xxs)'
    },

    '.s__sml': {
        fontSize: 'var(--f-font-size-xsm)'
    },

    '.s__med': {
        fontSize: 'var(--f-font-size-sml)'
    },

    '.s__lrg': {
        fontSize: 'var(--f-font-size-med)'
    },

    '.content': {
        padding: '.25em',
        maxHeight: '9.5em'
    },

    '.message': {
        position: 'relative',
        padding: '.5em',
        width: '100%',
        textAlign: 'center',
        color: 'var(--f-clr-grey-500)',
        lineHeight: 1.25
    },

    '.container .field': {
        margin: '.25em',
        marginBottom: 0
    },

    '.container .field__content': {
        paddingBlock: '.5em'
    }
});

export type ComboboxContentSelectors = Selectors<'container' | 'content' | 'message'>;

export default function Content({ children, cc = {}, size = 'med', autoFocus = true, searchable, placeholder = 'Search..', emptyMessage = 'Nothing found', round, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: ComboboxContentSelectors;
        size?: FluidSize;
        autoFocus?: boolean;
        searchable?: boolean;
        placeholder?: string;
        emptyMessage?: string;
        round?: boolean;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    const { trigger } = usePopover();
    const selected = useRef(searchable ? 0 : -1);
    const options = useRef<HTMLElement[]>([]);
    const [search, setSearch] = useState<string>('');

    let optionIndex = searchable ? 1 : 0;
    const filtered = Children.map(children, child => { // memo?
        if (isValidElement(child) && (child as React.ReactElement<any>).props.value.toString().toLowerCase().includes(search.toLowerCase())) {
            if ((child as React.ReactElement<any>).props.disabled) return child;

            const i = optionIndex++;

            const clone = cloneElement(child as React.ReactElement<any>, {
                autoFocus: autoFocus && i === 0,
                onFocus: () => selected.current = i,
                ref: (el: HTMLElement) => options.current[i] = el,
                round
            });

            return clone;
        }

        return null;
    });

    return <Popover.Content>
        <Animatable id="combobox-options-outer"
            animate={{
                opacity: [0, .2, 1],
                scale: [0.9, 1],
                duration: .2
            }}
            triggers={[
                { on: 'mount' },
                { on: 'unmount', reverse: true }
            ]}>

            <div {...props} role="listbox" className={classes(
                style.container,
                style[`s__${size}`],
                round && style.round,
                props.className
            )}
                onKeyDown={e => {
                    props.onKeyDown?.(e);

                    let reverse = e.key === 'ArrowUp' || e.shiftKey,
                        selection = reverse ? Math.max(selected.current - 1, -1) : Math.min(selected.current + 1, options.current.length - 1);

                    if (e.key === 'Tab' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                        let child: HTMLElement | null = options.current[selected.current = selection];

                        if (selected.current < 0) {
                            child = getFocusable(trigger.current, false);
                        }

                        child ? child.focus() : selected.current = 0;
                        if (child || e.key !== 'Tab') e.preventDefault();
                    }
                }}>
                {searchable && <Field
                    round={round}
                    size={size}
                    variant="minimal"
                    inputRef={(el: any) => options.current[0] = el}
                    autoFocus={autoFocus}
                    placeholder={placeholder}
                    value={search}
                    onFocus={() => selected.current = 0}
                    onChange={e => {
                        setSearch(e.target.value);
                    }}
                    icon={<Icon type="search" />}
                    cc={{
                        field: style.field,
                        content: style.field__content,
                        ...cc
                    }} />}

                <Scrollarea className={style.content}>
                    <div>
                        <Animatable
                            inherit
                            animate={{
                                opacity: [0, 1],
                                scale: [.95, 1],
                                duration: .2
                            }}
                            staggerLimit={4}
                            stagger={.05}>
                            {filtered}
                        </Animatable>

                        {!Children.count(filtered) && <div className={style.message}>
                            {emptyMessage}
                        </div>}
                    </div>
                </Scrollarea>
            </div>
        </Animatable>
    </Popover.Content>;
}

Content.displayName = 'Combobox.Content';