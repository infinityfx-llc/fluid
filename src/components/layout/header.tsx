import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { forwardRef, useState } from 'react';
import { Hamburger } from '../input';
import { Animatable } from '@infinityfx/lively';
import { Morph } from '@infinityfx/lively/layout';
import { Halo } from '../feedback';

const Header = forwardRef(({ styles = {}, links }:
    {
        styles?: FluidStyles;
        links?: {
            label: string;
            href?: string;
            links?: {
                label: string;
                href: string;
            }[];
        }[];
    }, ref: React.ForwardedRef<HTMLElement>) => {
    const style = useStyles(styles, {
        '.header': {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            backgroundColor: 'var(--f-clr-bg-100)',
            boxShadow: '0 0 8px rgb(0, 0, 0, .05)',
            borderBottom: 'solid 1px var(--f-clr-grey-100)',
            height: '5rem',
            paddingInline: '18rem',
            display: 'flex',
            alignItems: 'center',
            zIndex: 250
        },

        '.links': {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-sml)',
            marginLeft: 'var(--f-spacing-lrg)',
            height: '100%'
        },

        '.link': {
            position: 'relative',
            display: 'block',
            padding: '.4em',
            borderRadius: 'var(--f-radius-sml)',
            fontWeight: 600,
            color: 'var(--f-clr-text-100)'
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
            borderRadius: 'var(--f-radius-sml)',
            display: 'flex',
            flexDirection: 'column',
            padding: '.4em',
            minWidth: '8em',
            width: 'max-content',
            backgroundColor: 'var(--f-clr-bg-100)',
            border: 'solid 1px var(--f-clr-grey-100)',
            boxShadow: '0 0 8px rgb(0, 0, 0, .06)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999,
            overflow: 'hidden'
        },

        '.container': {
            position: 'relative',
        },

        '.container:first-child > .menu': {
            left: 0,
            transform: 'unset'
        },

        '.container:last-child > .menu': {
            right: 0,
            left: 'unset',
            transform: 'unset'
        },

        '.hamburger': {
            marginLeft: 'auto'
        }
    });

    const [selection, setSelection] = useState(0);
    const [menuVisible, setMenuVisible] = useState(false);

    return <header ref={ref} className={style.header}>
        <nav className={style.links} onMouseLeave={() => {
            setSelection(0);
            setMenuVisible(false);
        }}>
            {links?.map(({ label, href, links }, i) => {
                const showMenu = menuVisible && i === selection;

                return <div key={i} className={style.container}>
                    <a href={href} className={style.link} data-visible={true} onMouseEnter={() => {
                        setSelection(i);
                        setMenuVisible(true);
                    }} onFocus={() => setSelection(i)}>
                        {label}

                        <Morph id="fluid-header-navigation-selection" shown={i === selection} include={['translate', 'scale']} deform={false}>
                            <div className={style.selection} />
                        </Morph>
                    </a>

                    {links && <Morph id="fluid-header-navigation-menu" shown={showMenu} include={['translate', 'scale']} deform={false}>
                        <div className={style.menu}>
                            <Animatable noInherit animate={{ opacity: [0, 1], translate: ['100% 0%', '0% 0%'], duration: .5 }} triggers={[{ on: i === selection }, { on: i !== selection, reverse: true }]}>
                                {links?.map(({ label, href }, i) => {
                                    return <div key={i}>
                                        <Halo>
                                            <a href={href} className={style.link}>
                                                {label}
                                            </a>
                                        </Halo>
                                    </div>;
                                })}
                            </Animatable>
                        </div>
                    </Morph>}
                </div>;
            })}
        </nav>

        <Hamburger className={style.hamburger} />
    </header>;
});

Header.displayName = 'Header';

export default Header;