'use client';

import { Children, forwardRef, useId } from 'react';
import { FluidStyles, Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { classes, combineClasses } from '../../../core/utils';
import { Morph } from '@infinityfx/lively/layout';
import { useNavigationMenu } from './root';
import { Animatable } from '@infinityfx/lively';

type AnchorLike<T extends React.HTMLAttributes<HTMLAnchorElement>> = React.JSXElementConstructor<T> | 'a';

const Group = forwardRef(({ children, cc = {}, label, href, active = false, position = 'center', Link = 'a', ...props }:
    {
        cc?: Selectors<'link' | 'selection' | 'menu'>;
        label: React.ReactNode;
        href: string;
        active?: boolean;
        position?: 'start' | 'center' | 'end';
        Link?: AnchorLike<any>;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('navigation-menu.group', {
        '.group': {
            position: 'relative',
            display: 'flex',
            justifyContent: 'center'
        },

        '.link': {
            position: 'relative',
            padding: '.4em',
            borderRadius: 'var(--f-radius-sml)',
            fontWeight: 600,
            color: 'var(--f-clr-text-100)',
            outline: 'none',
            cursor: 'pointer'
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
            borderRadius: 'calc(.25em + var(--f-radius-sml))',
            padding: '.25em',
            width: 'max-content',
            backgroundColor: 'var(--f-clr-fg-100)',
            border: 'solid 1px var(--f-clr-fg-200)',
            boxShadow: 'var(--f-shadow-med)',
            zIndex: 999,
            overflow: 'hidden'
        }
    });
    const style = combineClasses(styles, cc);

    const linkId = useId();
    const { root, id, selection, select } = useNavigationMenu();
    const hasLinks = Children.count(children) > 0;

    return <div className={style.group}>
        <Link className={style.link}
            href={href}
            aria-expanded={hasLinks ? linkId === selection : undefined}
            aria-controls={hasLinks ? id + linkId : undefined}
            onMouseEnter={() => select(linkId)}
            onFocus={() => select(linkId)}
            onBlur={e => {
                if (!root.current?.contains(e.relatedTarget)) select(undefined);
            }}>

            {label}

            <Morph
                show={!selection ? active : linkId === selection}
                group={`fluid-navigation-menu-selection-${id}`}
                cachable={['x', 'sx']}
                deform={false}
                transition={{ duration: .35 }}
                animate={{ opacity: [1, 0], duration: .25 }}
                triggers={[{ on: 'mount', reverse: true }, { on: 'unmount' }]}>
                <div className={style.selection} />
            </Morph>
        </Link>

        {hasLinks && <Morph
            show={linkId === selection}
            group={`fluid-navigation-menu-group-${id}`}
            cachable={['x', 'y', 'sx', 'sy']}
            deform={false}
            transition={{ duration: .35 }}
            animate={{ opacity: [1, 0], translate: ['0px 0px', '0px -8px'], duration: .25 }}
            triggers={[{ on: 'mount', reverse: true }, { on: 'unmount' }]}>

            <div ref={ref} {...props}
                id={id + linkId}
                className={classes(style.menu, props.className)}
                style={{
                    ...props.style,
                    left: position === 'start' ? 0 : undefined,
                    right: position === 'end' ? 0 : undefined
                }}>
                <Animatable stagger={.06} triggers={[{ on: 'mount' }]}>
                    {children}
                </Animatable>
            </div>
        </Morph>}
    </div>;
});

Group.displayName = 'NavigationMenu.Group';

export default Group;