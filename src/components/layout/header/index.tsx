import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { forwardRef, useEffect, useRef } from 'react';
import Menu from './menu';
import { classes } from '@/src/core/utils';
import Navigation from './navigation';
import { Animatable } from '@infinityfx/lively';
import { useLink, useScroll } from '@infinityfx/lively/hooks';

type HeaderProps = {
    styles?: FluidStyles;
    variant?: 'default' | 'transparent';
    collapsible?: boolean;
} & React.HTMLAttributes<HTMLElement>;

const Header: React.ForwardRefExoticComponent<HeaderProps> & {
    Navigation: typeof Navigation;
    Menu: typeof Menu;
} = forwardRef(({ children, styles = {}, variant = 'default', collapsible, ...props }: HeaderProps, ref: React.ForwardedRef<HTMLElement>) => {
    const style = useStyles(styles, {
        '.header': {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '5rem',
            paddingInline: '18rem',
            display: 'flex',
            alignItems: 'center',
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
        <header ref={ref} {...props} className={classes(style.header, props.className)} data-variant={variant}>
            <Animatable noInherit animate={{ opacity: variant === 'transparent' ? scroll(val => Math.min(val / window.innerHeight * 2, 1)) : undefined }}>
                <div className={style.background} />
            </Animatable>

            {children}
        </header>
    </Animatable>;
}) as any;

Header.Navigation = Navigation;
Header.Menu = Menu;
Header.displayName = 'Header';

export default Header;