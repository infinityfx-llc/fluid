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
import useFluid from '../../../hooks/use-fluid';
import useMediaQuery from '../../../hooks/use-media-query';

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
    const styles = createStyles('sidebar.link', fluid => ({
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
            paddingLeft: '1.5em',
            transition: 'padding-left .3s, opacity .35s !important'
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
    const style = combineClasses(styles, cc);

    const [open, setOpen] = useState(false);
    const count = Children.count(children);
    const { collapsed } = useSidebar();

    const fluid = useFluid();
    const isMobile = useMediaQuery(`(max-width: ${fluid.breakpoints.mob}px)`);

    return <>
        <Halo color="var(--f-clr-primary-200)" disabled={disabled}>
            <div ref={ref} {...props} tabIndex={0}
                className={classes(
                    style.link,
                    style[`link__${size}`],
                    round && style.link__round,
                    props.className
                )}
                data-disabled={disabled}
                data-variant={variant}
                data-active={active}
                data-collapsed={collapsed}>
                {icon}

                <span className={style.content}>
                    {label}

                    {count ? <Toggle compact variant="minimal" size="sml" round={round} checked={open} checkedContent={<MdExpandLess />} onChange={e => {
                        e.stopPropagation();

                        setOpen(e.target.checked);
                    }} style={{ marginRight: '-.2em', color: active ? 'var(--f-clr-text-200)' : undefined }}>
                        <MdExpandMore />
                    </Toggle> : right}
                </span>
            </div>
        </Halo>

        {count ? <Collapsible shown={open && (isMobile || !collapsed)} className={style.sublinks} data-collapsed={collapsed}>
            {children}
        </Collapsible> : null}
    </>;
});

Link.displayName = 'Sidebar.Link';

export default Link;