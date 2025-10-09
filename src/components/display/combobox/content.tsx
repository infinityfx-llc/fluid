'use client';

import { Children, cloneElement, isValidElement, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Popover from '../../layout/popover';
import Scrollarea from '../../layout/scrollarea';
import Field from '../../input/field';
import { Animatable } from '@infinityfx/lively';
import { classes, combineClasses, combineRefs, getFocusable } from '../../../../src/core/utils';
import { FluidSize, Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { usePopover } from '../../layout/popover/root';
import { Icon } from '../../../core/icons';
import { useDebounce } from '../../../hooks';

const styles = createStyles('combobox.content', {
    '.container:not(.modal)': {
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
        maxHeight: '9.5em'
    },

    '.modal .content': {
        maxHeight: '50vh'
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

export type ComboboxContentSelectors = Selectors<'container' | 'modal' | 'content' | 'message'>;

export default function Content({
    children,
    cc = {},
    round,
    size = 'med',
    autoFocus = true,
    searchable = false,
    placeholder = 'Search..',
    emptyMessage = 'Nothing found',
    virtualItemHeight = 0,
    ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: ComboboxContentSelectors;
        round?: boolean;
        size?: FluidSize;
        /**
         * @default false
         */
        searchable?: boolean;
        /**
         * The placeholder text to show inside the optional searchbar.
         * 
         * @default "Search.."
         */
        placeholder?: string;
        /**
         * The text to show when there are no search results to show.
         * 
         * @default "Nothing found"
         */
        emptyMessage?: string;
        /**
         * When set to a `number` greater than `0`, will enable virtual scrolling, improving performance for large numbers of entries.
         */
        virtualItemHeight?: number;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    const { opened, trigger, content, isModal } = usePopover();

    const itemCount = useRef(0);
    const focus = useRef({
        list: [] as (HTMLElement | null)[],
        index: autoFocus ? 0 : -1
    });

    const [query, setQuery] = useState('');
    const [view, setView] = useState({ start: 0, end: Infinity });
    const search = useDebounce(value => {
        updateView(0);
        setQuery(value);
    }, 200);

    function updateView(scrollPosition: number) {
        if (!virtualItemHeight || !content.current) return setView({ start: 0, end: Infinity });

        const inView = Math.ceil(content.current.offsetHeight / virtualItemHeight),
            padding = Math.floor(inView / 2),
            index = padding + Math.floor(scrollPosition / (virtualItemHeight * padding)) * padding,
            start = Math.max(0, index - inView),
            end = start + inView * 2;

        if (view.end !== end) setView({
            start,
            end
        });
    }

    useLayoutEffect(() => {
        if (opened) updateView(0);
    }, [opened]);

    const filteredChildren = useMemo(() => {
        itemCount.current = 0;

        return Children.map(children, (child: any) => {
            const option = isValidElement<any>(child) && ('value' in child.props ? child : child.props.children);
            if (!isValidElement<any>(option) || !('value' in option.props)) return child;

            const value = ('' + option.props.value).toLowerCase() || '';
            if (!value.includes(query)) return null;

            const listIndex = itemCount.current++,
                focusIndex = listIndex + (searchable ? 1 : 0);
            if (listIndex < view.start || listIndex > view.end) return null;

            return cloneElement(child, {
                round,
                ref: combineRefs(el => {
                    focus.current.list[focusIndex] = el;
                }, child.props.ref),
                onFocus: (e: React.FocusEvent<any>) => {
                    focus.current.index = focusIndex;
                    props.onFocus?.(e);
                },
                autoFocus: focusIndex == focus.current.index
            });
        });
    }, [children, view, query]);

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
                isModal && style.modal,
                props.className
            )}
                onKeyDown={e => {
                    props.onKeyDown?.(e);

                    if (e.key !== 'Tab' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

                    const { index, list } = focus.current,
                        updatedIndex = (e.key === 'ArrowUp' || e.shiftKey) ?
                            Math.max(index - 1, -1) :
                            Math.min(index + 1, list.length - 1),
                        child = updatedIndex < 0 ?
                            getFocusable(trigger.current, false) :
                            list[focus.current.index = updatedIndex];

                    child ? child.focus() : focus.current.index = 0;
                    if (child || e.key !== 'Tab') e.preventDefault();
                }}>
                {searchable && <Field
                    round={round}
                    size={size}
                    variant="minimal"
                    placeholder={placeholder}
                    icon={<Icon type="search" />}
                    inputRef={(el: any) => focus.current.list[0] = el}
                    autoFocus={focus.current.index == 0}
                    onFocus={() => focus.current.index = 0}
                    defaultValue={query}
                    onChange={e => search(e.target.value.toLowerCase())}
                    cc={{
                        ...cc,
                        field: style.field,
                        content: style.field__content
                    }} />}

                <Scrollarea className={style.content} onScroll={e => updateView(e.currentTarget.scrollTop)}>
                    <div
                        style={{
                            padding: '.25em',
                            minHeight: virtualItemHeight ? virtualItemHeight * itemCount.current : undefined
                        }}>
                        <div style={{ height: virtualItemHeight * view.start }} />
                        <Animatable id="combobox-options-inner"
                            inherit
                            cachable={[]}
                            animate={{
                                opacity: [0, 1],
                                scale: [.95, 1],
                                duration: .2
                            }}
                            staggerLimit={4}
                            stagger={.05}>
                            {(!virtualItemHeight || view.end !== Infinity) && filteredChildren}
                        </Animatable>

                        {!itemCount.current && <div className={style.message}>
                            {emptyMessage}
                        </div>}
                    </div>
                </Scrollarea>
            </div>
        </Animatable>
    </Popover.Content>;
}

Content.displayName = 'Combobox.Content';