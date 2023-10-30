'use client';

import { Children, forwardRef, useState } from 'react';
import Halo from '../../feedback/halo';
import { FluidSize, FluidStyles, Selectors } from '../../../../src/types';
import { classes, combineClasses } from '../../../../src/core/utils';
import Toggle from '../../input/toggle';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import Collapsible from '../collapsible';
import { createStyles } from '../../../core/style';
import { useSidebar } from './root';

const Link = forwardRef(({ children, cc = {}, size = 'med', label, icon, right, active = false, round = false, variant = 'default', disabled = false, ...props }:
    {
        cc?: Selectors<'link' | 'link__sml' | 'link__med' | 'content' | 'sublinks'>;
        label: string;
        size?: Omit<FluidSize, 'xsm' | 'lrg'>;
        icon?: React.ReactNode;
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

        '.link__sml': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.link__med': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.link > *': {
            flexShrink: 0
        },

        '.link[data-disabled="false"]': {
            cursor: 'pointer'
        },

        '.link__round': {
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

        '.sublinks': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xsm)',
            transition: 'padding-left .3s, opacity .35s !important'
        },

        '.sublinks > *': {
            flexShrink: 0
        }
    });
    const style = combineClasses(styles, cc);

    const [open, setOpen] = useState(false);
    const count = Children.count(children);
    const { collapsed } = useSidebar();

    return <>
        <Halo color="var(--f-clr-primary-200)" disabled={disabled}>
            <div ref={ref} {...props} tabIndex={0} className={classes(
                style.link,
                style[`link__${size}`],
                round && style.link__round,
                props.className
            )} data-disabled={disabled} data-variant={variant} data-active={active}>
                {icon}

                <span className={style.content} style={{ opacity: collapsed ? 0 : 1 }}>
                    {label}

                    {count ? <Toggle variant="minimal" size="sml" round={round} checked={open} checkedContent={<MdExpandLess />} onChange={e => {
                        e.stopPropagation();

                        setOpen(e.target.checked);
                    }} style={{ marginRight: '-.2em', color: active ? 'var(--f-clr-text-200)' : undefined }}>
                        <MdExpandMore />
                    </Toggle> : right}
                </span>
            </div>
        </Halo>

        {count ? <Collapsible shown={open && !collapsed} className={style.sublinks} style={{ paddingLeft: collapsed ? undefined : '1.5em' }}>
            {children}
        </Collapsible> : null}
    </>;
});

Link.displayName = 'Link';

export default Link;