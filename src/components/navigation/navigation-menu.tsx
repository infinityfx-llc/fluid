'use client';

import { FluidStyles, Selectors } from '../../../src/types';
import { forwardRef, useState, useId, useRef } from 'react';
import { Animatable } from '@infinityfx/lively';
import { Morph } from '@infinityfx/lively/layout';
import Halo from '../feedback/halo';
import { classes, combineClasses } from '../../../src/core/utils';
import { createStyles } from '../../core/style';

// split into subcomponents for more options

export type NavigationMenuStyles = FluidStyles<'.navigation' | '.link' | '.selection' | '.menu' | '.container'>;

type AnchorLike<T extends React.HTMLAttributes<any> & { href: string; }> = React.JSXElementConstructor<T> | keyof React.ReactHTML;

const NavigationMenu = forwardRef(({ cc = {}, links, selected = -1, Link = 'a', ...props }:
    {
        cc?: Selectors<'navigation' | 'link' | 'selection' | 'menu' | 'container'>;
        links?: {
            label: string;
            href: string;
            links?: {
                label: React.ReactNode;
                href: string;
            }[];
        }[];
        selected?: number;
        Link?: AnchorLike<any>;
    } & Omit<React.HTMLAttributes<HTMLElement>, 'children'>, ref: React.ForwardedRef<HTMLElement>) => {
    const styles = createStyles('navigation-menu', {
        '.navigation': {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-sml)',
            height: '100%'
        },

        '.link': {
            position: 'relative',
            display: 'block',
            padding: '.4em',
            borderRadius: 'var(--f-radius-sml)',
            fontWeight: 600,
            color: 'var(--f-clr-text-100)',
            outline: 'none'
        },

        '.selection': {
            position: 'absolute',
            inset: 0,
            borderRadius: 'var(--f-radius-sml)',
            backgroundColor: 'var(--f-clr-primary-500)',
            zIndex: -1
        },

        '.menu': {
            position: 'absolute',
            top: 'calc(100% + var(--f-spacing-sml))',
            borderRadius: 'calc(.25em + var(--f-radius-sml))',
            display: 'flex',
            flexDirection: 'column',
            padding: '.25em',
            minWidth: '8em',
            width: 'max-content',
            backgroundColor: 'var(--f-clr-fg-100)',
            border: 'solid 1px var(--f-clr-fg-200)',
            boxShadow: '0 0 8px rgb(0, 0, 0, .06)',
            zIndex: 999,
            overflow: 'hidden'
        },

        '.container': {
            position: 'relative',
            display: 'flex',
            justifyContent: 'center'
        },

        '.container:first-child > .menu': {
            left: 0
        },

        '.container:last-child > .menu': {
            right: 0
        }
    });
    const style = combineClasses(styles, cc);

    const id = useId();
    const prev = useRef(-1);
    const [selection, setSelection] = useState(selected);
    const [menuVisible, setMenuVisible] = useState(false);

    function update(index: number) {
        prev.current = selection;

        if (index < 0) {
            setMenuVisible(false);
            setSelection(selected);
        } else {
            setMenuVisible(true);
            setSelection(index);
        }
    }

    return <nav ref={ref} {...props} className={classes(style.navigation, props.className)}
        onMouseLeave={e => {
            props.onMouseLeave?.(e);
            update(-1);
        }}>

        {links?.map(({ label, href, links }, i) => {
            const showMenu = menuVisible && i === selection;
            const left = prev.current - selection < 0;

            return <div key={i} className={style.container}>
                <Link href={href} className={style.link}
                    aria-expanded={links ? showMenu : undefined}
                    aria-controls={links ? i + id : undefined}
                    onMouseEnter={() => update(i)}
                    onFocus={() => update(i)}
                    onBlur={() => setTimeout(() => prev.current !== i && update(-1))}>
                    {label}

                    <Morph
                        show={i === selection}
                        group={`fluid-header-navigation-selection-${id}`}
                        cachable={['translate', 'scale']}
                        deform={false}
                        transition={{ duration: .35 }}
                        animate={{ opacity: [1, 0], duration: .25 }}
                        triggers={[{ on: 'mount', reverse: true }, { on: 'unmount' }]}>
                        <div className={style.selection} />
                    </Morph>
                </Link>

                {links && <Morph
                    show={showMenu}
                    group={`fluid-header-navigation-menu-${id}`}
                    cachable={['translate', 'scale']}
                    deform={false}
                    transition={{ duration: .35 }}
                    animate={{ opacity: [1, 0], translate: ['0px 0px', '0px -8px'], duration: .25 }}
                    triggers={[{ on: 'mount', reverse: true }, { on: 'unmount' }]}>
                    <div className={style.menu} id={i + id}>
                        <Animatable
                            stagger={.06}
                            animate={{
                                opacity: [0, 1],
                                translate: left ? ['32px 0px', '0px 0px'] : ['-32px 0px', '0px 0px'],
                                duration: .3,
                                delay: .15
                            }}
                            triggers={[{ on: 'mount' }]}>
                            {links?.map(({ label, href }, i) => {
                                return <Halo key={i}>
                                    <Link href={href} className={style.link}>
                                        {label}
                                    </Link>
                                </Halo>;
                            })}
                        </Animatable>
                    </div>
                </Morph>}
            </div>;
        })}
    </nav>;
});

NavigationMenu.displayName = 'NavigationMenu';

export default NavigationMenu;