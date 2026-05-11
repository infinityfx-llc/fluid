'use client';

import { PolymorphComponentProps, Selectors } from '../../../../src/types';
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

type AnchorLike = React.ComponentType<{
    href: string;
    className?: string;
    onBlur?: (e: React.FocusEvent<any>) => void;
}> | 'a';

export default function Link<A extends AnchorLike>({ children, cc = {}, as, ...props }:
    {
        ref?: React.Ref<HTMLAnchorElement>;
        cc?: NavigationMenuLinkSelectors;
        /**
         * What type of component or element to render this component as.
         * 
         * @default HTMLAnchorElement
         */
        as?: A;
    } & Omit<PolymorphComponentProps<A>, 'as'>) {
    const style = combineClasses(styles, cc);

    const { root, select } = useNavigationMenu();

    return <Halo
        {...props}
        as={as || 'a'}
        color="var(--f-clr-primary-400)"
        role="menuitem"
        className={classes(style.link, props.className)}
        onBlur={(e: React.FocusEvent<any>) => {
            props.onBlur?.(e);
            if (!root.current?.contains(e.relatedTarget)) select(undefined);
        }}>
        {children}
    </Halo>;
}

Link.displayName = 'NavigationMenu.Link';