import { forwardRef } from 'react';
import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { classes } from '@/src/core/utils';
import { Halo, Indicator } from '../../feedback';

const User = forwardRef(({ styles = {}, avatar, name, status, indicator, round = false, ...props }:
    {
        styles?: FluidStyles;
        name: string;
        avatar?: any;
        status?: string;
        indicator?: string | number | boolean;
        round?: boolean;
    } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const style = useStyles(styles, {
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
            fontSize: 'var(--f-font-size-sml)'
        },

        '.user[data-round="true"]': {
            borderRadius: '999px'
        },

        '.user:enabled': {
            cursor: 'pointer'
        },

        '.avatar': {
            position: 'relative',
            width: '2.5em',
            height: '2.5em',
            backgroundColor: 'var(--f-clr-primary-400)',
            borderRadius: 'var(--f-radius-sml)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '1.2em',
            flexShrink: 0
        },

        '.user[data-round="true"] .avatar': {
            borderRadius: '999px'
        },

        '.name': {
            fontWeight: 600
        },

        '.status': {
            fontSize: '.8em',
            color: 'var(--f-clr-grey-500)'
        },

        '.content': {
            transition: 'opacity .3s'
        },

        'aside[data-collapsed="true"] .content': {
            opacity: 0
        }
    });

    return <Halo disabled={props.disabled} color="var(--f-clr-primary-400)">
        <button ref={ref} {...props} type="button" className={classes(style.user, props.className)} data-round={round}>
            <Indicator outline="var(--f-clr-bg-100)" content={indicator} round={round}>
                <div className={style.avatar}>
                    {avatar ? avatar : name.slice(0, 2)}
                </div>
            </Indicator>
            <div className={style.content}>
                <div className={style.name}>{name}</div>
                <div className={style.status}>{status}</div>
            </div>
        </button>
    </Halo>;
});

User.displayName = 'Sidebar.User';

export default User;