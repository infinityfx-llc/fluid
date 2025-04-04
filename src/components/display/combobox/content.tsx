'use client';

import { Children, isValidElement, useLayoutEffect } from 'react';
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

// some props move to Root.. might be weird (maybe move all of them?)
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

    const { opened, trigger, isModal, query, search, view, setView, selection } = usePopover<ComboboxContext>();

    useLayoutEffect(() => {
        if (opened) {
            selection.current.map.clear(); // optimize?

            const numInView = Math.ceil((isModal ? window.innerHeight / 2 : 152) / h), // 152 == placeholder (calculate with em values??)
                pad = Math.floor(numInView / 2);
            setView({ from: 0, to: numInView + pad });
        }
    }, [opened]);

    // todo:
    // just use let index here (way easier...)
    // also check against view here, but still increment index
    // also keep track of num of items in this loop, used for correct container height
    const filtered = Children.map(children, (child: any) => {
        if (isValidElement<any>(child) &&
            'value' in child.props &&
            !('' + child.props.value).toLowerCase().includes(query)) return null;

        return child;
    });

    const h = 36, // placeholder (use itemHeight prop or something??)
        length = Children.count(filtered); // doesnt work with filtering..

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

                <Scrollarea className={style.content} onScroll={e => { // doesnt get called when searching (manually reset scroll position when searching and height changes)
                    const numInView = Math.ceil((isModal ? window.innerHeight / 2 : 152) / h), // 152 == placeholder
                        pad = Math.floor(numInView / 2),
                        index = pad + Math.floor(e.currentTarget.scrollTop / (h * pad)) * pad,
                        from = Math.max(0, index - pad),
                        to = Math.min(length - 1, from + numInView + pad);

                    if (view.from !== from || view.to !== to) setView({ from, to });
                }}>
                    <div style={{ height: h * length }}>
                        <div style={{ height: h * view.from }} />
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

                        {!length && <div className={style.message}>
                            {emptyMessage}
                        </div>}
                    </div>
                </Scrollarea>
            </div>
        </Animatable>
    </Popover.Content>;
}

Content.displayName = 'Combobox.Content';