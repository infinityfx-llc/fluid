'use client';

import useStyles from '@/src/hooks/use-styles';
import { FluidSize, FluidStyles } from '@/src/types';
import { forwardRef, useEffect, useRef } from 'react';
import { classes } from '@/src/core/utils';
import { Animatable } from '@infinityfx/lively';
import { useLink, useScroll } from '@infinityfx/lively/hooks';
import useFluid from '@/src/hooks/use-fluid';

const Header = forwardRef(({ children, styles = {}, variant = 'default', size = 'med', width = 'med', collapsible, left, right, sidebar = 'none', ...props }:
    {
        styles?: FluidStyles;
        variant?: 'default' | 'transparent';
        size?: FluidSize;
        width?: FluidSize;
        collapsible?: boolean;
        left?: React.ReactNode;
        right?: React.ReactNode;
        sidebar?: 'none' | 'collapsed' | 'expanded';
    } & React.HTMLAttributes<HTMLElement>, ref: React.ForwardedRef<HTMLElement>) => {
    const fluid = useFluid();

    const style = useStyles(styles, {
        '.header': {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: `var(--f-header-${size})`,
            display: 'flex',
            zIndex: 250
        },

        '.background': {
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            backgroundColor: 'var(--f-clr-bg-100)'
        },

        '.header[data-variant="default"] .background': {
            boxShadow: '0 0 8px rgb(0, 0, 0, .05)',
            borderBottom: 'solid 1px var(--f-clr-grey-100)'
        },

        '.left': {
            width: `var(--f-page-${width})`,
            transition: 'width .3s'
        },

        '.right': {
            width: `var(--f-page-${width})`
        },

        '.content': {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-lrg)',
        },

        [`@media(min-width: ${fluid.breakpoints[1] + 1}px)`]: {
            '.header[data-sidebar="collapsed"] .left': {
                width: `max(calc(5rem + var(--f-spacing-lrg)), var(--f-page-${width}))`
            },

            '.header[data-sidebar="expanded"] .left': {
                width: `calc(var(--f-sidebar) + var(--f-spacing-lrg))`
            }
        }
    });

    const scroll = useScroll();
    const last = useRef(0);
    const [hidden, setHidden] = useLink(false);

    useEffect(() => {
        function scroll() {
            const delta = window.scrollY - last.current;
            if (collapsible && delta > 0 !== hidden()) setHidden(delta > 0, .4);

            last.current = window.scrollY;
        }

        window.addEventListener('scroll', scroll);

        return () => window.removeEventListener('scroll', scroll);
    }, []);

    return <Animatable animate={{ translate: hidden(val => val ? '0% -100%' : '0% 0%') }}>
        <header ref={ref} {...props} className={classes(style.header, props.className)} data-variant={variant} data-sidebar={sidebar}>
            <Animatable noInherit animate={{ opacity: variant === 'transparent' ? scroll(val => Math.min(val / window.innerHeight * 2, 1)) : undefined }}>
                <div className={style.background} />
            </Animatable>

            <section className={style.left}>
                {left}
            </section>

            <section className={style.content}>
                {children}
            </section>

            <section className={style.right}>
                {right}
            </section>
        </header>
    </Animatable>;
});

Header.displayName = 'Header';

export default Header;