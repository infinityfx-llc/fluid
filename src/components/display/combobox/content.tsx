'use client';

import { Children, forwardRef, useState, isValidElement, useRef, cloneElement } from 'react';
import Popover from '../../layout/popover';
import Scrollarea from '../../layout/scrollarea';
import Field from '../../input/field';
import { MdSearch } from 'react-icons/md';
import { Animatable } from '@infinityfx/lively';
import { Move, Pop } from '@infinityfx/lively/animations';
import { classes } from '@/src/core/utils';
import { FluidStyles } from '@/src/types';
import { useStyles } from '@/src/hooks';

type ComboboxContentStyles = FluidStyles<'.container' | '.content' | '.message'>;

const Content = forwardRef(({ children, styles = {}, searchable, placeholder = 'Search..', emptyMessage = 'Nothing found', ...props }:
    {
        styles?: ComboboxContentStyles;
        searchable?: boolean;
        placeholder?: string;
        emptyMessage?: string;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.container': {
            background: 'var(--f-clr-bg-100)',
            border: 'solid 1px var(--f-clr-fg-200)',
            borderRadius: 'calc(.3em + var(--f-radius-sml))',
            boxShadow: '0 0 8px rgb(0, 0, 0, 0.06)',
            minWidth: 'clamp(0px, 10em, 100vw)',
            width: '100%',
            overflow: 'hidden'
        },

        '.content': {
            padding: '.3em',
            maxHeight: '10.3em'
        },

        '.message': {
            position: 'relative',
            padding: '.5em',
            borderRadius: 'var(--f-radius-sml)',
            border: 'none',
            outline: 'none',
            background: 'none',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--f-clr-grey-500)'
        }
    });

    const selected = useRef(searchable ? 0 : -1);
    const options = useRef<HTMLElement[]>([]);
    const [search, setSearch] = useState<string>('');

    let optionIndex = 0, focused = false;
    const filtered = Children.map(children, child => {
        if (isValidElement(child) && child.props.value.toString().toLowerCase().includes(search.toLowerCase())) {
            if (child.props.disabled) return child;

            const i = (searchable ? 1 : 0) + optionIndex++;

            const clone = cloneElement(child as React.ReactElement, {
                autoFocus: !focused && !searchable,
                ref: (el: HTMLElement) => options.current[i] = el
            });

            return (focused = true, clone);
        }

        return null;
    });

    return <Popover.Content>
        <Animatable key="combobox-options-outer" animate={Move.unique({ duration: .2 })} unmount triggers={[{ on: 'mount' }]}>
            <div ref={ref} {...props} role="listbox" className={classes(style.container, props.className)}
                onKeyDown={e => {
                    props.onKeyDown?.(e);

                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                        e.preventDefault();

                        selected.current = e.key === 'ArrowDown' ? Math.min(selected.current + 1, options.current.length - 1) : Math.max(selected.current - 1, 0);
                        options.current[selected.current]?.focus();
                    }
                }}>
                {searchable && <Field
                    inputRef={(el: any) => options.current[0] = el}
                    autoFocus
                    placeholder={placeholder}
                    value={search}
                    onChange={e => {
                        selected.current = 0;
                        setSearch(e.target.value);
                    }}
                    icon={<MdSearch />}
                    styles={{ // merge with outer styles
                        '.field': {
                            border: 'none',
                            borderRadius: 0,
                            borderBottom: 'solid 1px var(--f-clr-fg-200) !important',
                            backgroundColor: 'var(--f-clr-bg-100)'
                        },

                        '.wrapper': {
                            width: 'auto'
                        }
                    }} />}

                <Scrollarea className={style.content}>
                    <div className={style.options}>
                        <Animatable key="combobox-options-inner" animate={Pop.unique({ duration: .2 })} staggerLimit={4} stagger={.06}>
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