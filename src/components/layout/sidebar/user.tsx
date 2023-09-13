'use client';

import { forwardRef } from 'react';
import { FluidStyles, Selectors } from '../../../../src/types';
import { classes, combineClasses } from '../../../../src/core/utils';
import Halo from '../../feedback/halo';
import Indicator from '../../feedback/indicator';
import { MdMoreVert } from 'react-icons/md';
import { createStyles } from '../../../core/style';

const User = forwardRef(({ children, cc = {}, name, status, indicator = false, round = false, icon = <MdMoreVert />, ...props }:
    {
        cc?: Selectors<'user' | 'avatar' | 'frame' | 'name' | 'status' | 'content' | 'icon'>;
        name: string;
        status?: string;
        indicator?: string | number | boolean;
        round?: boolean;
        icon?: React.ReactNode;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const styles = createStyles('sidebar.user', {
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

        '.user[data-round="true"] .frame': {
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
            transition: 'opacity .3s',
            flexShrink: 1,
            flexGrow: 1,
            width: 0
        },

        '.icon': {
            fontSize: '1.1em',
            display: 'flex',
            alignItems: 'center',
            marginLeft: 'auto',
            transition: 'opacity .3s'
        },

        'aside[data-collapsed="true"] .content': {
            opacity: 0
        },

        'aside[data-collapsed="true"] .icon': {
            opacity: 0
        }
    });
    const style = combineClasses(styles, cc);

    return <Halo disabled={props.disabled} color="var(--f-clr-primary-400)">
        <button ref={ref} {...props} type="button" className={classes(style.user, props.className)} data-round={round}>
            <Indicator outline="var(--f-clr-bg-100)" content={indicator} round={round}>
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

User.displayName = 'User';

export default User;