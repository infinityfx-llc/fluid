'use client';

import { Children, useId } from 'react';
import { Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { classes, combineClasses } from '../../../core/utils';
import { LayoutGroup, Morph } from '@infinityfx/lively/layout';
import { useNavigationMenu } from './root';
import { Animatable } from '@infinityfx/lively';
import { Icon } from '../../../core/icons';

const styles = createStyles('navigation-menu.group', {
    '.group': {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center'
    },

    '.link': {
        position: 'relative',
        padding: '.4em .6em',
        borderRadius: 'var(--f-radius-sml)',
        fontWeight: 600,
        color: 'var(--f-clr-text-100)',
        outline: 'none',
        cursor: 'pointer',
        lineHeight: 1.25,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xsm)'
    },

    '.link.round': {
        borderRadius: '1em'
    },

    '.arrow': {
        display: 'flex',
        transition: 'rotate .35s',
        fontSize: '.8em'
    },

    '.selection': {
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        backgroundColor: 'var(--f-clr-primary-400)',
        zIndex: -1
    },

    '.menu': {
        position: 'absolute',
        top: 'calc(100% + var(--f-spacing-sml))',
        borderRadius: 'calc(.25em + var(--f-radius-sml))',
        padding: '.25em',
        backgroundColor: 'var(--f-clr-fg-100)',
        border: 'solid 1px var(--f-clr-fg-200)',
        boxShadow: 'var(--f-shadow-med)',
        overflow: 'hidden',
        zIndex: 99
    }
});

export type NavigationMenuGroupSelectors = Selectors<'group' | 'link' | 'arrow' | 'selection' | 'menu'>;

type AnchorLike<T extends React.HTMLAttributes<HTMLAnchorElement>> = React.JSXElementConstructor<T> | 'a';

export default function Group({ children, cc = {}, label, round = false, href, target, active = false, position = 'center', Link = 'a', ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: NavigationMenuGroupSelectors;
        label: React.ReactNode;
        round?: boolean;
        href?: string;
        target?: '_blank' | '_parent' | '_self' | '_top';
        active?: boolean;
        position?: 'start' | 'center' | 'end';
        Link?: AnchorLike<any>;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    const linkId = useId();
    const { root, id, selection, select } = useNavigationMenu();
    const hasLinks = Children.count(children) > 0;

    return <div className={style.group}>
        <Link className={classes(
            style.link,
            round && style.round
        )}
            role="menuitem"
            href={href}
            target={target}
            aria-haspopup={hasLinks ? 'menu' : undefined}
            aria-expanded={hasLinks ? linkId === selection : undefined}
            aria-controls={hasLinks ? id + linkId : undefined}
            onMouseEnter={() => select(linkId)}
            onFocus={() => select(linkId)}
            onBlur={e => {
                if (!root.current?.contains(e.relatedTarget)) select(undefined);
            }}>

            {label}

            {hasLinks && <div
                className={style.arrow}
                style={{
                    rotate: linkId === selection ? '180deg' : '0deg'
                }}>
                <Icon type="down" />
            </div>}

            <LayoutGroup>
                {(selection ? linkId === selection : active) && <Morph
                    id="fluid-navigation-menu-selection"
                    group={`fluid-navigation-menu-selection-${id}`}
                    cachable={['x', 'sx', 'borderRadius']}
                    deform={false}
                    transition={{ duration: .35 }}
                    animate={{ opacity: [1, 0], duration: .25 }}
                    triggers={[{ on: 'mount', reverse: true }, { on: 'unmount' }]}>
                    <div className={style.selection} />
                </Morph>}
            </LayoutGroup>
        </Link>

        <LayoutGroup>
            {hasLinks && linkId === selection && <Morph
                id="fluid-navigation-menu-group"
                group={`fluid-navigation-menu-group-${id}`}
                cachable={['x', 'y', 'sx', 'sy']}
                deform={false}
                transition={{ duration: .35 }}
                animate={{ opacity: [1, 0], translate: ['0px 0px', '0px -8px'], duration: .25 }}
                triggers={[{ on: 'mount', reverse: true }, { on: 'unmount' }]}>

                <div {...props}
                    id={id + linkId}
                    role="menu"
                    className={classes(style.menu, props.className)}
                    style={{
                        ...props.style,
                        left: position === 'start' ? 0 : undefined,
                        right: position === 'end' ? 0 : undefined
                    }}>
                    <Animatable stagger={.06} triggers={[{ on: 'mount', delay: .25 }]}>
                        {children}
                    </Animatable>
                </div>
            </Morph>}
        </LayoutGroup>
    </div>;
}

Group.displayName = 'NavigationMenu.Group';