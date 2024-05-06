'use client';

import { forwardRef } from 'react';
import { Selectors } from '../../../../src/types';
import { classes, combineClasses } from '../../../../src/core/utils';
import Halo from '../../feedback/halo';
import Indicator from '../../feedback/indicator';
import { createStyles } from '../../../core/style';
import { useSidebar } from './root';
import { Icon } from '../../../core/icons';

const styles = createStyles('sidebar.user',  fluid => ({
    '.user': {
        position: 'relative',
        outline: 'none',
        border: 'none',
        borderRadius: 'var(--f-radius-sml)',
        background: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-sml)',
        textAlign: 'left',
        color: 'var(--f-clr-text-100)',
        height: '3em',
        paddingRight: '.5em',
        fontSize: 'var(--f-font-size-sml)'
    },

    '.user.round': {
        borderRadius: '999px'
    },

    '.user:enabled': {
        cursor: 'pointer'
    },

    '.avatar': {
        position: 'relative',
        width: '2.5em',
        height: '2.5em',
        fontWeight: 700,
        textTransform: 'uppercase',
        fontSize: '1.2em',
        flexShrink: 0,
    },

    '.frame': {
        position: 'absolute',
        inset: 0,
        borderRadius: 'var(--f-radius-sml)',
        overflow: 'hidden',
        backgroundColor: 'var(--f-clr-primary-400)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    '.user.round .frame': {
        borderRadius: '999px'
    },

    '.name': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontWeight: 600
    },

    '.status': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '.8em',
        color: 'var(--f-clr-grey-500)'
    },

    '.content': {
        flexShrink: 1,
        flexGrow: 1,
        width: 0,
        transition: 'opacity .3s'
    },

    '.icon': {
        fontSize: '1.1em',
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto',
        transition: 'opacity .3s'
    },

    [`@media (min-width: ${fluid.breakpoints.mob + 1}px)`]: {
        '.user[data-collapsed="true"] .content, .user[data-collapsed="true"] .icon': {
            opacity: 0
        }
    }
}));

export type SidebarUserSelectors = Selectors<'user' | 'round' | 'avatar' | 'frame' | 'name' | 'status' | 'content' | 'icon'>;

const User = forwardRef(({ children, cc = {}, name, status, indicator = false, round = false, icon = <Icon type="more" />, ...props }:
    {
        cc?: SidebarUserSelectors;
        name: string;
        status?: string;
        indicator?: string | number | boolean;
        round?: boolean;
        icon?: React.ReactNode;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const style = combineClasses(styles, cc);
    const { collapsed } = useSidebar();

    return <Halo disabled={props.disabled} color="var(--f-clr-primary-400)">
        <button ref={ref} {...props} type="button" className={classes(
            style.user,
            round && style.round,
            props.className
        )} data-collapsed={collapsed}>
            <Indicator outline="var(--f-clr-bg-100)" content={indicator}>
                <div className={style.avatar}>
                    <div className={style.frame}>
                        {children ? children : name.slice(0, 2)}
                    </div>
                </div>
            </Indicator>

            <div className={style.content}>
                <div className={style.name}>{name}</div>
                <div className={style.status}>{status}</div>
            </div>

            {icon && <div className={style.icon}>
                {icon}
            </div>}
        </button>
    </Halo>;
});

User.displayName = 'Sidebar.User';

export default User;