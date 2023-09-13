'use client';

import { Children, forwardRef, useState } from 'react';
import Halo from '../../feedback/halo';
import { FluidStyles, Selectors } from '../../../../src/types';
import { classes, combineClasses } from '../../../../src/core/utils';
import Toggle from '../../input/toggle';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import Collapsible from '../collapsible';
import { createStyles } from '../../../core/style';

const Link = forwardRef(({ children, cc = {}, label, icon, right, active = false, round = false, variant = 'default', disabled = false, ...props }:
    {
        cc?: Selectors<'link' | 'content' | 'sublinks'>;
        label: string;
        icon: React.ReactNode;
        right?: React.ReactNode;
        active?: boolean;
        variant?: 'default' | 'light',
        round?: boolean;
    } & React.ButtonHTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('sidebar.link', {
        '.link': {
            position: 'relative',
            outline: 'none',
            border: 'none',
            background: 'none',
            fontSize: 'var(--f-font-size-sml)',
            fontWeight: 600,
            borderRadius: 'var(--f-radius-sml)',
            color: 'var(--f-clr-text-100)',
            display: 'flex',
            gap: 'var(--f-spacing-sml)',
            alignItems: 'center',
            paddingInline: '1em',
            height: '3em',
            transition: 'background-color .25s, color .25s'
        },

        '.link > *': {
            flexShrink: 0
        },

        '.link[data-disabled="false"]': {
            cursor: 'pointer'
        },

        '.link[data-round="true"]': {
            borderRadius: '999px'
        },

        '.link[data-active="true"]': {
            backgroundColor: 'var(--f-clr-primary-100)',
            color: 'var(--f-clr-text-200)'
        },

        '.link[data-active="true"][data-variant="light"]': {
            backgroundColor: 'var(--f-clr-primary-600)',
            color: 'var(--f-clr-primary-100)'
        },

        '.link[data-disabled="true"]': {
            color: 'var(--f-clr-grey-500)'
        },

        '.content': {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-sml)',
            justifyContent: 'space-between',
            transition: 'opacity .3s',
            flexGrow: 1
        },

        'aside[data-collapsed="true"] .content': {
            opacity: 0
        },

        '.sublinks': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xsm)',
            transition: 'padding-left .3s, opacity .35s !important'
        },

        'aside[data-collapsed="false"] .sublinks': {
            paddingLeft: '1.5em'
        },

        '.sublinks > *': {
            flexShrink: 0
        }
    });
    const style = combineClasses(styles, cc);

    const [open, setOpen] = useState(false);
    const count = Children.count(children);

    return <>
        <Halo color="var(--f-clr-primary-200)" disabled={disabled}>
            <div ref={ref} {...props} className={classes(style.link, props.className)} data-disabled={disabled} data-variant={variant} data-round={round} data-active={active}>
                {icon}

                <span className={style.content}>
                    {label}

                    {count ? <Toggle size="sml" round={round} checked={open} checkedContent={<MdExpandLess />} onChange={e => {
                        e.stopPropagation();

                        setOpen(e.target.checked);
                    }} style={{ marginRight: '-.2em' }}>
                        <MdExpandMore />
                    </Toggle> : right}
                </span>
            </div>
        </Halo>

        {count ? <Collapsible shown={open} className={style.sublinks}>
            {children}
        </Collapsible> : null}
    </>;
});

Link.displayName = 'Link';

export default Link;