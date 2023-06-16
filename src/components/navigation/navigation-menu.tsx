import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { forwardRef, useState, useId, useRef } from 'react';
import { Animatable } from '@infinityfx/lively';
import { Morph } from '@infinityfx/lively/layout';
import { Halo } from '../feedback';
import { classes } from '@/src/core/utils';

const NavigationMenu = forwardRef(({ styles = {}, links, selected = -1, Link = 'a', ...props }:
    {
        styles?: FluidStyles;
        links?: {
            label: string;
            href: string;
            links?: {
                label: React.ReactNode;
                href: string;
            }[];
        }[];
        selected?: number;
        Link?: React.JSXElementConstructor<React.HTMLAttributes<any> & { href: string; }> | keyof React.ReactHTML;
    } & Omit<React.HTMLAttributes<HTMLElement>, 'children'>, ref: React.ForwardedRef<HTMLElement>) => {
    const style = useStyles(styles, {
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
            borderRadius: 'calc(.2em + var(--f-radius-sml))',
            display: 'flex',
            flexDirection: 'column',
            padding: '.4em',
            minWidth: '8em',
            width: 'max-content',
            backgroundColor: 'var(--f-clr-bg-100)',
            border: 'solid 1px var(--f-clr-grey-100)',
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
                    onMouseEnter={() => update(i)}
                    onFocus={() => update(i)}>
                    {label}

                    <Morph id={`fluid-header-navigation-selection-${id}`} shown={i === selection} include={['translate', 'scale']} deform={false} transition={{ duration: .35 }}>
                        <div className={style.selection} />
                    </Morph>
                </Link>

                {links && <Morph id={`fluid-header-navigation-menu-${id}`} shown={showMenu} include={['translate', 'scale']} deform={false} transition={{ duration: .35 }}>
                    <div className={style.menu}>
                        <Animatable noInherit
                            stagger={.06}
                            animations={{
                                left: { opacity: [0, 1], translate: ['32px 0px', '0px 0px'], duration: .3, delay: .15 },
                                right: { opacity: [0, 1], translate: ['-32px 0px', '0px 0px'], duration: .3, delay: .15 }
                            }}
                            triggers={[
                                { on: showMenu && left, immediate: true, name: 'left' },
                                { on: showMenu && !left, immediate: true, name: 'right' }
                            ]}>
                            {links?.map(({ label, href }, i) => {
                                return <div key={i}>
                                    <Halo>
                                        <Link href={href} className={style.link}>
                                            {label}
                                        </Link>
                                    </Halo>
                                </div>;
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