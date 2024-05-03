'use client';

import { Children, forwardRef, useState, isValidElement, useRef, cloneElement } from 'react';
import Popover from '../../layout/popover';
import Scrollarea from '../../layout/scrollarea';
import Field from '../../input/field';
import { MdSearch } from 'react-icons/md';
import { Animatable } from '@infinityfx/lively';
import { Move, Pop } from '@infinityfx/lively/animations';
import { classes, combineClasses, getFocusable } from '../../../../src/core/utils';
import { FluidSize, Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { usePopover } from '../../layout/popover/root';

const styles = createStyles('combobox.content', {
    '.container': {
        background: 'var(--f-clr-fg-100)',
        border: 'solid 1px var(--f-clr-fg-200)',
        borderRadius: 'calc(.25em + var(--f-radius-sml))',
        boxShadow: 'var(--f-shadow-med)',
        minWidth: 'min(100vw, 10em)',
        width: '100%',
        overflow: 'hidden'
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
        maxHeight: '10em'
    },

    '.message': {
        position: 'relative',
        padding: '.5em',
        width: '100%',
        textAlign: 'center',
        color: 'var(--f-clr-grey-500)'
    },

    '.container .wrapper': {
        padding: '.25em',
        paddingBottom: 0
    },

    '.container .field': {
        border: 'none',
        backgroundColor: 'var(--f-clr-bg-100)'
    }
});

export type ComboboxContentSelectors = Selectors<'container' | 'content' | 'message'>;

const Content = forwardRef(({ children, cc = {}, size = 'med', autoFocus = true, searchable, placeholder = 'Search..', emptyMessage = 'Nothing found', ...props }:
    {
        cc?: ComboboxContentSelectors;
        size?: FluidSize;
        autoFocus?: boolean;
        searchable?: boolean;
        placeholder?: string;
        emptyMessage?: string;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = combineClasses(styles, cc);

    const { trigger } = usePopover();
    const selected = useRef(searchable ? 0 : -1);
    const options = useRef<HTMLElement[]>([]);
    const [search, setSearch] = useState<string>('');

    let optionIndex = 0;
    const filtered = Children.map(children, child => {
        if (isValidElement(child) && child.props.value.toString().toLowerCase().includes(search.toLowerCase())) {
            if (child.props.disabled) return child;

            const i = (searchable ? 1 : 0) + optionIndex++;

            const clone = cloneElement(child as React.ReactElement, {
                autoFocus: autoFocus && optionIndex === 0,
                onFocus: () => selected.current = i,
                ref: (el: HTMLElement) => options.current[i] = el
            });

            return clone;
        }

        return null;
    });

    return <Popover.Content>
        <Animatable id="combobox-options-outer" animate={Move.unique({ duration: .2 })} triggers={[{ on: 'mount' }, { on: 'unmount', reverse: true }]}>
            <div ref={ref} {...props} role="listbox" className={classes(
                style.container,
                style[`s__${size}`],
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
                    size={size}
                    inputRef={(el: any) => options.current[0] = el}
                    autoFocus={autoFocus}
                    placeholder={placeholder}
                    value={search}
                    onChange={e => {
                        selected.current = 0;
                        setSearch(e.target.value);
                    }}
                    icon={<MdSearch />}
                    cc={{
                        wrapper: style.wrapper,
                        field: style.field,
                        ...cc
                    }} />}

                <Scrollarea className={style.content}>
                    <div className={style.options}>
                        <Animatable inherit animate={Pop.unique({ duration: .2 })} staggerLimit={4} stagger={.06}>
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
});

Content.displayName = 'Combobox.Content';

export default Content;