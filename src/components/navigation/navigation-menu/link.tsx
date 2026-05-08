'use client';

import { Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { classes, combineClasses } from '../../../core/utils';
import Halo from '../../feedback/halo';
import { useNavigationMenu } from './root';

const styles = createStyles('navigation-menu.link', {
    '.link': {
        position: 'relative',
        display: 'block',
        padding: '.4em',
        borderRadius: 'var(--f-radius-sml)',
        fontWeight: 600,
        color: 'var(--f-clr-text-100)',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent'
    }
});

export type NavigationMenuLinkSelectors = Selectors<'link'>;

type AnchorLike<T extends React.HTMLAttributes<HTMLAnchorElement>> = React.JSXElementConstructor<T> | 'a';

export default function Link({ children, cc = {}, as, ...props }:
    {
        ref?: React.Ref<HTMLAnchorElement>;
        cc?: NavigationMenuLinkSelectors;
        /**
         * A custom component to use as a link element.
         * 
         * Defaults to the HTML `<a>` element.
         */
        as?: AnchorLike<any>;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    const style = combineClasses(styles, cc);

    const { root, select } = useNavigationMenu();
    const Wrapper = as || 'a';

    return <Halo color="var(--f-clr-primary-400)">
        <Wrapper
            {...props}
            role="menuitem"
            className={classes(style.link, props.className)}
            onBlur={(e: React.FocusEvent<any>) => {
                props.onBlur?.(e);
                if (!root.current?.contains(e.relatedTarget)) select(undefined);
            }}>
            {children}
        </Wrapper>
    </Halo>;
}

Link.displayName = 'NavigationMenu.Link';