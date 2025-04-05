'use client';

import { Children, isValidElement, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Popover from '../../layout/popover';
import Scrollarea from '../../layout/scrollarea';
import Field from '../../input/field';
import { Animatable } from '@infinityfx/lively';
import { classes, combineClasses, getFocusable } from '../../../../src/core/utils';
import { FluidSize, Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { usePopover } from '../../layout/popover/root';
import { Icon } from '../../../core/icons';
import { ComboboxContext } from './root';
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
        padding: '.25em',
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

// fix focus indexing
// fix extra empty elements add end of list??
export default function Content({
    children,
    cc = {},
    round,
    size = 'med',
    autoFocus = true,
    searchable,
    placeholder = 'Search..',
    emptyMessage = 'Nothing found',
    virtualItemHeight = 0,
    ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: ComboboxContentSelectors;
        round?: boolean;
        size?: FluidSize;
        autoFocus?: boolean;
        searchable?: boolean;
        placeholder?: string;
        emptyMessage?: string;
        virtualItemHeight?: number;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    const itemCount = useRef(0);
    const [query, setQuery] = useState('');
    const search = useDebounce(value => {
        setQuery(value);
        updateView(0);
    }, 200);
    const [view, setView] = useState({ start: 0, end: Infinity });

    const { opened, trigger, content, isModal, selection } = usePopover<ComboboxContext>();

    function updateView(scrollPosition: number) {
        if (!virtualItemHeight || !content.current) return setView({ start: 0, end: Infinity });

        const inView = Math.ceil(content.current.offsetHeight / virtualItemHeight),
            padding = Math.floor(inView / 2),
            index = padding + Math.floor(scrollPosition / (virtualItemHeight * padding)) * padding,
            start = Math.max(0, index - padding),
            end = Math.min(itemCount.current - 1, start + inView + padding);

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
            if (!isValidElement<any>(child)) return child;
            if ('value' in child.props &&
                !('' + child.props.value).toLowerCase().includes(query)) return null;

            const index = itemCount.current++;
            if (index < view.start || index > view.end) return null;

            return child;
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

                    let { index, list } = selection.current,
                        reverse = e.key === 'ArrowUp' || e.shiftKey,
                        updatedIndex = reverse ?
                            Math.max(index - 1, -1) :
                            Math.min(index + 1, list.length - 1);

                    if (e.key === 'Tab' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                        let child = list[selection.current.index = updatedIndex];

                        if (updatedIndex < 0) {
                            child = getFocusable(trigger.current, false);
                        }

                        child ? child.focus() : selection.current.index = 0;
                        if (child || e.key !== 'Tab') e.preventDefault();
                    }
                }}>
                {searchable && <Field
                    round={round}
                    size={size}
                    variant="minimal"
                    inputRef={(el: any) => selection.current.list[0] = el}
                    autoFocus={autoFocus}
                    placeholder={placeholder}
                    onFocus={() => selection.current.index = 0}
                    onChange={e => search(e.target.value.toLowerCase())}
                    icon={<Icon type="search" />}
                    cc={{
                        field: style.field,
                        content: style.field__content,
                        ...cc
                    }} />}

                <Scrollarea
                    className={style.content}
                    onScroll={e => updateView(e.currentTarget.scrollTop)}>
                    <div style={virtualItemHeight ? { height: virtualItemHeight * itemCount.current } : undefined}>
                        <div style={{ height: virtualItemHeight * view.start }} />
                        <Animatable
                            inherit
                            animate={{
                                opacity: [0, 1],
                                scale: [.95, 1],
                                duration: .2
                            }}
                            staggerLimit={4}
                            stagger={.05}>
                            {filteredChildren}
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