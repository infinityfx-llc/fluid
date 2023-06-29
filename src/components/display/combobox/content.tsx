'use client';

import { Children, forwardRef, useState, isValidElement } from 'react';
import Popover from '../../layout/popover';
import Scrollarea from '../../layout/scrollarea';
import { useStyles } from '@/src/hooks';
import Field from '../../input/field';
import { MdSearch } from 'react-icons/md';
import { Animatable } from '@infinityfx/lively';
import { Move, Pop } from '@infinityfx/lively/animations';
import { classes } from '@/src/core/utils';

const Content = forwardRef(({ children, searchable, placeholder = 'Search..', emptyMessage = 'Nothing found', ...props }:
    {
        searchable?: boolean;
        placeholder?: string;
        emptyMessage?: string;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles({
        '.container': {
            background: 'var(--f-clr-bg-100)',
            border: 'solid 1px var(--f-clr-fg-200)',
            borderRadius: 'calc(.3em + var(--f-radius-sml))',
            boxShadow: '0 0 8px rgb(0, 0, 0, 0.06)',
            width: '100%',
            // minWidth: 'clamp(0px, 10em, 100vw)',
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

    const [search, setSearch] = useState<string>('');

    const filtered = Children.map(children, child => {
        if (isValidElement(child) && child.props.value.toString().includes(search)) return child;

        return null;
    });

    // FIX ARIA STUFF!!!

    return <Popover.Content>
        <Animatable key="combobox-options-outer" animate={Move.unique({ duration: .2 })} unmount triggers={[{ on: 'mount' }]}>
            <div ref={ref} {...props} role="listbox" className={classes(style.container, props.className)}>
                {searchable && <Field
                    role="combobox"
                    aria-autocomplete="list"
                    autoFocus
                    placeholder={placeholder}
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value);
                    }}
                    icon={<MdSearch />}
                    styles={{
                        '.field': {
                            border: 'none',
                            borderRadius: 0,
                            borderBottom: 'solid 1px var(--f-clr-fg-200) !important',
                            backgroundColor: 'var(--f-clr-bg-100)'
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