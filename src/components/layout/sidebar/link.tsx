'use client';

import { Children, forwardRef, useState } from 'react';
import Halo from '../../feedback/halo';
import { Selectors } from '../../../../src/types';
import { classes, combineClasses } from '../../../../src/core/utils';
import Toggle from '../../input/toggle';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import Collapsible from '../collapsible';
import { createStyles } from '../../../core/style';
import { useSidebar } from './root';
import useFluid from '../../../hooks/use-fluid';
import useMediaQuery from '../../../hooks/use-media-query';

const styles = createStyles('sidebar.link', fluid => ({
    '.link': {
        position: 'relative',
        fontWeight: 600,
        borderRadius: 'var(--f-radius-sml)',
        color: 'var(--f-clr-text-100)',
        display: 'flex',
        gap: 'var(--f-spacing-sml)',
        alignItems: 'center',
        paddingInline: '1em',
        minWidth: '3em',
        height: '3em',
        transition: 'background-color .25s, color .25s',
        outline: 'none'
    },

    '.s__sml': {
        fontSize: 'var(--f-font-size-xsm)'
    },

    '.s__med': {
        fontSize: 'var(--f-font-size-sml)'
    },

    '.icon': {
        minWidth: '1em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    '.link[data-disabled="false"]': {
        cursor: 'pointer'
    },

    '.link.round': {
        borderRadius: '999px'
    },

    '.link[data-active="true"]': {
        backgroundColor: 'var(--f-clr-primary-100)',
        color: 'var(--f-clr-text-200)'
    },

    '.v__light[data-active="true"]': {
        backgroundColor: 'var(--f-clr-primary-600)',
        color: 'var(--f-clr-primary-100)'
    },

    '.link[data-disabled="true"]': {
        color: 'var(--f-clr-grey-500)'
    },

    '.link .toggle': {
        marginRight: '-.3em'
    },

    '.v__default[data-active="true"] .toggle': {
        color: 'var(--f-clr-text-200)'
    },

    '.content': {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-sml)',
        justifyContent: 'space-between',
        transition: 'opacity .3s',
        flexGrow: 1,
        flexShrink: 0
    },

    '.sublinks': {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--f-spacing-xsm)',
        paddingLeft: '1.5em',
        transition: 'padding-left .3s, margin-bottom .3s, opacity .35s !important'
    },

    '.sublinks > *': {
        flexShrink: 0
    },

    [`@media (min-width: ${fluid.breakpoints.mob + 1}px)`]: {
        '.link[data-collapsed="true"] .content': {
            opacity: 0
        },

        '.sublinks[data-collapsed="true"]': {
            paddingLeft: '0em'
        }
    }
}));

export type SidebarLinkSelectors = Selectors<'link' | 's__sml' | 's__med' | 'v__default' | 'v__light' | 'round' | 'icon' | 'content' | 'sublinks'>;

const Link = forwardRef(({ children, cc = {}, size = 'med', label, icon, right, active = false, round = false, variant = 'default', disabled = false, ...props }:
    {
        cc?: SidebarLinkSelectors;
        label: string;
        size?: 'sml' | 'med';
        icon?: React.ReactNode;
        right?: React.ReactNode;
        active?: boolean;
        variant?: 'default' | 'light',
        round?: boolean;
    } & React.ButtonHTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = combineClasses(styles, cc);

    const [open, setOpen] = useState(false);
    const count = Children.count(children);
    const { collapsed } = useSidebar();

    const fluid = useFluid();
    const isMobile = useMediaQuery(`(max-width: ${fluid.breakpoints.mob}px)`);

    return <>
        <Halo color={active ? undefined : 'var(--f-clr-primary-300)'} disabled={disabled}>
            <div ref={ref} {...props} tabIndex={0}
                className={classes(
                    style.link,
                    style[`s__${size}`],
                    style[`v__${variant}`],
                    round && style.round,
                    props.className
                )}
                data-disabled={disabled}
                data-active={active}
                data-collapsed={collapsed}>
                <div className={style.icon}>
                    {icon}
                </div>

                <span className={style.content}>
                    {label}

                    {count ? <Toggle
                        cc={{
                            toggle: style.toggle,
                            ...cc
                        }}
                        compact
                        variant="minimal"
                        size={size === 'med' ? 'sml' : 'xsm'}
                        round={round}
                        checked={open}
                        checkedContent={<MdExpandLess />}
                        onChange={e => {
                            e.stopPropagation();

                            setOpen(e.target.checked);
                        }}>
                        <MdExpandMore />
                    </Toggle> : right}
                </span>
            </div>
        </Halo>

        {count ? <Collapsible
            shown={open && (isMobile || !collapsed)}
            cc={{ content: style.sublinks, ...cc }}
            style={{
                marginBottom: open ? undefined : 'calc(var(--f-spacing-xsm) * -1)'
            }}
            data-collapsed={collapsed}>
            {children}
        </Collapsible> : null}
    </>;
});

Link.displayName = 'Sidebar.Link';

export default Link;