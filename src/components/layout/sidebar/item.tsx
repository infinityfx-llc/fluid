'use client';

import { Children, useState } from 'react';
import Halo from '../../feedback/halo';
import { Selectors } from '../../../../src/types';
import { classes, combineClasses } from '../../../../src/core/utils';
import Toggle from '../../input/toggle';
import Collapsible from '../collapsible';
import { createStyles } from '../../../core/style';
import { useSidebar } from './root';
import useFluid from '../../../hooks/use-fluid';
import useMediaQuery from '../../../hooks/use-media-query';
import { Icon } from '../../../core/icons';

const styles = createStyles('sidebar.item', fluid => ({
    '.item': {
        position: 'relative',
        fontWeight: 600,
        borderRadius: 'var(--f-radius-sml)',
        color: 'var(--f-clr-text-100)',
        display: 'flex',
        transition: 'background-color .25s, color .25s',
        outline: 'none'
    },

    '.item:not(.compact)': {
        height: '3em'
    },

    '.s__sml': {
        fontSize: 'var(--f-font-size-xsm)'
    },

    '.s__med': {
        fontSize: 'var(--f-font-size-sml)'
    },

    '.icon': {
        height: 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    },

    '.item:not(.compact) .icon': {
        width: '3em'
    },

    '.item[data-disabled="false"]': {
        cursor: 'pointer'
    },

    '.item.round': {
        borderRadius: '999px'
    },

    '.item[data-active="true"]': {
        backgroundColor: 'var(--f-clr-primary-100)',
        color: 'var(--f-clr-text-200)'
    },

    '.v__light[data-active="true"]': {
        backgroundColor: 'var(--f-clr-primary-600)',
        color: 'var(--f-clr-primary-100)'
    },

    '.item[data-disabled="true"]': {
        color: 'var(--f-clr-grey-500)'
    },

    '.item .toggle': {
        marginRight: '-.3em'
    },

    '.item.compact .toggle': {
        background: 'transparent',
        color: 'var(--f-clr-text-100)',
        pointerEvents: 'none',
        marginRight: 0
    },

    '.item.compact .toggle__content': {
        padding: 0
    },

    '.v__default[data-active="true"] .toggle': {
        color: 'var(--f-clr-text-200)'
    },

    '.content': {
        paddingRight: '1em',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-sml)',
        justifyContent: 'space-between',
        transition: 'opacity .3s',
        flexGrow: 1,
        flexShrink: 0
    },

    '.item.compact .icon': {
        padding: '.6em',
        lineHeight: 1
    },

    '.item.compact .content': {
        paddingRight: '.6em',
        paddingBlock: '.6em',
        lineHeight: 1
    },

    '.content[data-hasicon="false"]': {
        paddingLeft: '1em'
    },

    '.item.compact .content[data-hasicon="false"]': {
        paddingLeft: '.6em'
    },

    '.children': {
        paddingLeft: '1.5em',
        transition: 'padding-left .3s, margin-bottom .3s, opacity .35s !important'
    },

    '.children > *': {
        flexShrink: 0
    },

    [`@media (min-width: ${fluid.breakpoints.mob + 1}px)`]: {
        '.item.collapsed .content': {
            opacity: 0
        },

        '.children[data-collapsed="true"]': {
            paddingLeft: '0em'
        }
    }
}));

export type SidebarItemSelectors = Selectors<'item' | 'collapsed' | 's__sml' | 's__med' | 'v__default' | 'v__light' | 'round' | 'compact' | 'icon' | 'content' | 'children'>;

export default function Item({ children, cc = {}, size = 'med', label, icon, right, active = false, round, compact, variant = 'default', disabled = false, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: SidebarItemSelectors;
        label: string;
        size?: 'sml' | 'med';
        icon?: React.ReactNode;
        right?: React.ReactNode;
        active?: boolean;
        variant?: 'default' | 'light',
        round?: boolean;
        compact?: boolean;
    } & React.ButtonHTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    const [open, setOpen] = useState(false);
    const count = Children.count(children);
    const { collapsed } = useSidebar();

    const fluid = useFluid();
    const isMobile = useMediaQuery(`(max-width: ${fluid.breakpoints.mob}px)`);

    return <>
        <Halo color={active ? undefined : 'var(--f-clr-primary-300)'} disabled={disabled}>
            <div {...props}
                tabIndex={0}
                className={classes(
                    style.item,
                    style[`s__${size}`],
                    style[`v__${variant}`],
                    round && style.round,
                    compact && style.compact,
                    collapsed && style.collapsed,
                    props.className
                )}
                data-disabled={disabled}
                data-active={active}
                onClick={() => setOpen(!open)}>

                {icon !== undefined && <div className={style.icon}>
                    {icon}
                </div>}

                <span className={style.content} data-hasicon={icon !== undefined}>
                    {label}

                    {count ? <Toggle
                        cc={{
                            toggle: style.toggle,
                            content: style.toggle__content,
                            ...cc
                        }}
                        disabled={compact}
                        compact
                        variant="minimal"
                        size={size === 'med' ? 'sml' : 'xsm'}
                        round={round}
                        checked={open}
                        checkedContent={<Icon type="collapseUp" />}>
                        <Icon type="expandDown" />
                    </Toggle> : right}
                </span>
            </div>
        </Halo>

        {count ? <Collapsible
            shown={open && (isMobile || !collapsed)}
            cc={{ content: style.children, ...cc }}
            data-collapsed={collapsed}>
            {children}
        </Collapsible> : null}
    </>;
}

Item.displayName = 'Sidebar.Item';