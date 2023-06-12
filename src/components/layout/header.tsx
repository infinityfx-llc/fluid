import useStyles from '@/src/hooks/use-styles';
import { FluidSize, FluidStyles } from '@/src/types';
import { forwardRef, useEffect, useRef } from 'react';
import { classes } from '@/src/core/utils';
import { Animatable } from '@infinityfx/lively';
import { useLink, useScroll } from '@infinityfx/lively/hooks';
import useFluid from '@/src/hooks/use-fluid';
import useLayout from '@/src/hooks/use-layout';

export type HeaderProps = {
    styles?: FluidStyles;
    variant?: 'default' | 'transparent';
    size?: FluidSize;
    width?: FluidSize;
    collapsible?: boolean;
} & React.HTMLAttributes<HTMLElement>;

const Header = forwardRef(({ children, styles = {}, variant = 'default', size = 'med', width = 'med', collapsible, ...props }: HeaderProps, ref: React.ForwardedRef<HTMLElement>) => {
    const fluid = useFluid();
    const { sidebar, collapsed } = useLayout({ header: variant === 'transparent' ? false : size });

    const style = useStyles(styles, {
        '.header': {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: `var(--f-header-${size})`,
            paddingLeft: `var(--f-page-${width})`,
            paddingRight: `var(--f-page-${width})`,
            display: 'flex',
            gap: 'var(--f-spacing-med)',
            alignItems: 'center',
            zIndex: 250,
            transition: 'padding-left .3s'
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

        [`@media(min-width: ${fluid.breakpoints[1] + 1}px)`]: {
            '.header[data-sidebar="true"][data-collapsed="true"]': {
                paddingLeft: `max(calc(5rem + var(--f-spacing-lrg)), var(--f-page-${width}))`
            },

            '.header[data-sidebar="true"]': {
                paddingLeft: `calc(var(--f-sidebar) + var(--f-spacing-lrg))`
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
        <header ref={ref} {...props} className={classes(style.header, props.className)} data-variant={variant} data-sidebar={sidebar} data-collapsed={collapsed}>
            <Animatable noInherit animate={{ opacity: variant === 'transparent' ? scroll(val => Math.min(val / window.innerHeight * 2, 1)) : undefined }}>
                <div className={style.background} />
            </Animatable>

            {children}
        </header>
    </Animatable>;
});

Header.displayName = 'Header';

export default Header;

// add right/left sections