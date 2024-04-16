'use client';

import { forwardRef } from 'react';
import { FluidStyles, Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { classes, combineClasses } from '../../../core/utils';
import { Halo } from '../../feedback';
import { useNavigationMenu } from './root';

type AnchorLike<T extends React.HTMLAttributes<HTMLAnchorElement>> = React.JSXElementConstructor<T> | 'a';

const Link = forwardRef(({ children, cc = {}, Link = 'a', ...props }:
    {
        cc?: Selectors<'link' | 'selection' | 'menu'>;
        Link?: AnchorLike<any>;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>, ref: React.ForwardedRef<HTMLAnchorElement>) => {
    const styles = createStyles('navigation-menu.link', {
        '.link': {
            padding: '.4em',
            borderRadius: 'var(--f-radius-sml)',
            fontWeight: 600,
            outline: 'none'
        }
    });
    const style = combineClasses(styles, cc);

    const { root, select } = useNavigationMenu();

    return <Halo color="var(--f-clr-primary-400)">
        <Link ref={ref} {...props}
            className={classes(style.link, props.className)}
            onBlur={e => {
                props.onBlur?.(e);
                if (!root.current?.contains(e.relatedTarget)) select(undefined);
            }}>
            {children}
        </Link>
    </Halo>;
});

Link.displayName = 'NavigationMenu.Link';

export default Link;