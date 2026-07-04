'use client';

import { useCallback, useLayoutEffect, useRef } from 'react';
import Popover from '../../layout/popover';
import Scrollarea from '../../layout/scrollarea';
import Field from '../../input/field';
import { Animate } from '@infinityfx/lively';
import { classes, combineClasses, getFocusable } from '../../../../src/core/utils';
import { FluidSize, Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { usePopover } from '../../layout/popover/root';
import { Icon } from '../../../core/icons';
import { useDebounce } from '../../../hooks';
import { useMenuManager } from '../../../context/menu-manager';

const styles = createStyles('combobox.content', {
    '.container:not(.modal)': {
        backgroundColor: 'var(--f-clr-fg-100)',
        border: 'solid 1px var(--f-clr-fg-200)',
        borderRadius: 'calc(.25em + var(--f-radius-sml))',
        boxShadow: 'var(--f-shadow-med)',
        minWidth: 'min(100vw, 10em)',
        width: '100%'
    },

    '.container.round': {
        borderRadius: '1.4em'
    },

    '.v__inverted:not(.modal)': {
        backgroundColor: 'var(--f-clr-grey-900)'
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
    },

    '.v__inverted:not(.modal) .field': {
        background: 'var(--f-clr-grey-900)',
        color: 'var(--f-clr-grey-700)'
    },

    '.v__inverted:not(.modal) .field:focus-within': {
        background: 'var(--f-clr-grey-800)'
    },

    '.v__inverted:not(.modal) .input': {
        color: 'var(--f-clr-text-200)'
    }
});

export type ComboboxContentSelectors = Selectors<'container' | 'modal' | 'content' | 'message'>;

export default function Content({
    children,
    cc = {},
    size = 'med',
    searchable = false,
    placeholder = 'Search..',
    emptyMessage = 'Nothing found',
    virtualItemHeight = 0,
    ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: ComboboxContentSelectors;
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

    const wasOpened = useRef(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const { opened, trigger, content, isModal } = usePopover();
    const {
        round,
        variant,
        autoFocus,
        searchQuery,
        virtualView,
        setSearchQuery,
        setVirtualView,
        initOptionsList,
        filterOptionsList,
        optionCount,
        focus
    } = useMenuManager();

    initOptionsList(searchable);

    const search = useDebounce(value => {
        updateView(0);
        setSearchQuery(value);
    }, 200);

    const updateView = useCallback((scrollPosition: number) => {
        if (!virtualItemHeight || !content.current) return setVirtualView({ from: 0, to: Infinity });

        const inView = Math.ceil(content.current.offsetHeight / virtualItemHeight),
            padding = Math.floor(inView / 2),
            index = padding + Math.floor(scrollPosition / (virtualItemHeight * padding)) * padding,
            start = Math.max(0, index - inView),
            end = start + inView * 2;

        if (virtualView.to !== end) setVirtualView({
            from: start,
            to: end
        });
    }, [virtualView]);

    useLayoutEffect(() => {
        if (!opened) {
            wasOpened.current = false;
            return;
        }

        if (!wasOpened.current) {
            wasOpened.current = true;
            // setFocus(autoFocus ? 0 : -1);
            updateView(0);
        }

        filterOptionsList(searchInputRef.current);
    }, [opened, searchable, searchQuery, virtualView, children, virtualItemHeight, autoFocus]);

    return <Popover.Content>
        <Animate
            correction="none"
            key="combobox-options-outer"
            animate={{
                opacity: [0, .2, 1],
                scale: [0.9, 1],
                duration: .2
            }}
            triggers={{
                animate: ['mount', { on: 'unmount', reverse: true }]
            }}>

            <div
                {...props}
                role="listbox"
                className={classes(
                    style.container,
                    style[`s__${size}`],
                    style[`v__${variant}`],
                    round && style.round,
                    isModal && style.modal,
                    props.className
                )}
                onBlur={e => {
                    props.onBlur?.(e);
                    focus.current.index = -1;
                }}
                onKeyDown={e => {
                    props.onKeyDown?.(e);

                    if (e.key !== 'Tab' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

                    const { list, index } = focus.current;
                    const updatedIndex = (e.key === 'ArrowUp' || e.shiftKey) ?
                        Math.max(index - 1, -1) :
                        Math.min(index + 1, list.length - 1);
                    const child = updatedIndex < 0 ?
                        getFocusable(trigger.current, false) : // TODO: focusing trigger not working
                        list[updatedIndex];

                    focus.current.index = updatedIndex;
                    if (child) child.focus();

                    if (child || e.key !== 'Tab') e.preventDefault();
                }}>
                {searchable && <Field
                    round={round}
                    size={size}
                    variant="minimal"
                    placeholder={placeholder}
                    icon={<Icon type="search" />}
                    inputRef={searchInputRef}
                    autoFocus={focus.current.index === 0}
                    onFocus={() => focus.current.index = 0}
                    defaultValue={searchQuery}
                    onChange={e => search(e.target.value.toLowerCase())}
                    cc={{
                        ...cc,
                        field: style.field,
                        content: style.field__content,
                        input: style.input
                    }} />}

                <Scrollarea
                    className={style.content}
                    onScroll={e => updateView(e.currentTarget.scrollTop)}
                    onTouchStart={e => e.stopPropagation()}>
                    <div
                        style={{
                            padding: '.25em',
                            minHeight: virtualItemHeight ? virtualItemHeight * optionCount : undefined
                        }}>
                        <div style={{ height: virtualItemHeight * virtualView.from }} />
                        <Animate
                            inherit
                            animate={{
                                opacity: [0, 1],
                                scale: [.95, 1],
                                duration: .2
                            }}
                            staggerLimit={4}
                            stagger={.05}>
                            {(!virtualItemHeight || virtualView.to !== Infinity) && children}
                        </Animate>

                        {!optionCount && <div className={style.message}>
                            {emptyMessage}
                        </div>}
                    </div>
                </Scrollarea>
            </div>
        </Animate>
    </Popover.Content>;
}

Content.displayName = 'Combobox.Content';