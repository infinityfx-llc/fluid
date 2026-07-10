'use client';

import { Selectors } from '../../../../src/types';
import { classes, combineClasses } from '../../../../src/core/utils';
import { IndicatorBadge, IndicatorRoot } from '../../feedback/indicator';
import { createStyles } from '../../../core/style';
import { useSidebar } from './root';
import { Icon } from '../../../core/icons';
import Interactable from '../../feedback/interactable';

const styles = createStyles('sidebar-user', {
    '.user': {
        position: 'relative',
        borderRadius: 'var(--f-radius-sml)',
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

    '.user.collapsed .content, .user.collapsed .icon': {
        opacity: 0
    }
});

export type SidebarUserSelectors = Selectors<'user' | 'collapsed' | 'round' | 'avatar' | 'frame' | 'name' | 'status' | 'content' | 'icon'>;

export default function User({ children, cc = {}, name, status, indicator = false, round = false, icon = <Icon type="more" />, ...props }:
    {
        ref?: React.Ref<HTMLButtonElement>;
        cc?: SidebarUserSelectors;
        name: string;
        status?: string;
        indicator?: string | number | boolean;
        round?: boolean;
        icon?: React.ReactNode;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const style = combineClasses(styles, cc);
    const { collapsed } = useSidebar();

    return <Interactable
        {...props}
        disabled={props.disabled}
        highlightColor="var(--f-clr-primary-400)"
        className={classes(
            style.user,
            round && style.round,
            collapsed && style.collapsed,
            props.className
        )}>
        <IndicatorRoot className={style.avatar}>
            <div className={style.frame}>
                {children ? children : name.slice(0, 2)}
            </div>

            <IndicatorBadge outline="var(--f-clr-bg-100)">
                {indicator}
            </IndicatorBadge>
        </IndicatorRoot>

        <div className={style.content}>
            <div className={style.name}>{name}</div>
            <div className={style.status}>{status}</div>
        </div>

        {
            icon && <div className={style.icon}>
                {icon}
            </div>
        }
    </Interactable >;
}

User.displayName = 'SidebarUser';