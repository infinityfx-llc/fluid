import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { forwardRef, useEffect, useState } from 'react';
import { Animatable } from '@infinityfx/lively';
import { Morph } from '@infinityfx/lively/layout';
import { Halo } from '../../feedback';
import { classes } from '@/src/core/utils';
import useFluid from '@/src/hooks/use-fluid';

const Navigation = forwardRef(({ children, styles = {}, links, ...props }: {
    styles?: FluidStyles;
    links?: {
        label: string;
        href: string;
        links?: {
            label: React.ReactNode;
            href: string;
        }[];
    }[];
} & React.HTMLAttributes<HTMLElement>, ref: React.ForwardedRef<HTMLElement>) => {
    const fluid = useFluid();
    const style = useStyles(styles, {
        '.navigation': {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-sml)',
            height: '100%'
        },

        [`@media (max-width: ${fluid.breakpoints[1]}px)`]: {
            '.navigation': {
                display: 'none !important'
            }
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
            zIndex: 999,
            overflow: 'hidden'
        },

        '.container': {
            position: 'relative',
            display: 'flex',
            justifyContent: 'center'
        },

        '.container:first-child > .menu': {
            left: 0,
            transform: 'unset'
        },

        '.container:last-child > .menu': {
            right: 0,
            left: 'unset',
            transform: 'unset'
        }
    });

    const [root, setRoot] = useState(-1);
    const [selection, setSelection] = useState(-1);
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        let matched = 0, length = 0;

        links?.forEach(({ href }, i) => {
            const len = href.replace(/^(\/|\\)$/, '').split(/\/|\\/).length;
            if (len > length && window.location.pathname.includes(href)) {
                length = len;
                matched = i;
            }
        });

        setRoot(matched);
        setSelection(matched);
    }, []);

    return <nav ref={ref} {...props} className={classes(style.navigation, props.className)} onMouseLeave={() => {
        setSelection(root);
        setMenuVisible(false);
    }}>
        {links?.map(({ label, href, links }, i) => {
            const showMenu = menuVisible && i === selection;

            return <div key={i} className={style.container}>
                <a href={href} className={style.link} data-visible={true} onMouseEnter={() => {
                    setSelection(i);
                    setMenuVisible(true);
                }} onFocus={() => {
                    setSelection(i);
                    setMenuVisible(true);
                }}>
                    {label}

                    <Morph id="fluid-header-navigation-selection" shown={i === selection} include={['translate', 'scale']} deform={false}>
                        <div className={style.selection} />
                    </Morph>
                </a>

                {links && <Morph id="fluid-header-navigation-menu" shown={showMenu} include={['translate', 'scale']} deform={false}>
                    <div className={style.menu}>
                        <Animatable noInherit animate={{ opacity: [0, 1], translate: ['100% 0%', '0% 0%'], duration: .5 }} triggers={[{ on: showMenu }]}>
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
    </nav>;
});

Navigation.displayName = 'Header.Navigation';

export default Navigation;

// solution to using NextJS link components