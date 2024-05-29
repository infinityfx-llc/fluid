'use client';

import { Selectors } from '../../../../src/types';
import { classes, combineClasses } from '../../../../src/core/utils';
import { createStyles } from '../../../core/style';
import { Icon } from '../../../core/icons';
import { useSidebar } from './root';
import Button from '../../input/button';
import Halo from '../../feedback/halo';

const styles = createStyles('sidebar.toggle', {
    '.wrapper': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        flexShrink: 0
    },

    '.toggle': {
        position: 'relative',
        overflow: 'hidden',
        background: 'none',
        outline: 'none',
        border: 'none',
        color: 'var(--f-clr-text-100)',
        borderRadius: 'var(--f-radius-sml)',
        flexShrink: 0
    },

    '.toggle:enabled': {
        cursor: 'pointer'
    },

    '.logo': {
        width: '3rem',
        height: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'translate .25s'
    },

    '.icon': {
        inset: 0,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        translate: '-100% 0%',
        transition: 'translate .25s'
    },

    '.toggle:enabled:hover .logo, .toggle:enabled:focus-visible .logo': {
        translate: '100% 0%'
    },

    '.toggle:enabled:hover .icon, .toggle:enabled:focus-visible .icon': {
        translate: '0% 0%'
    },

    '.button[data-collapsed="true"]': {
        opacity: 0
    }
});

export type SidebarToggleSelectors = Selectors<'wrapper' | 'toggle' | 'logo' | 'icon'>;

export default function Toggle({ children, cc = {}, toggle = 'square', ...props }: // rename to logotoggle??
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: SidebarToggleSelectors;
        toggle?: 'square' | 'round' | 'none';
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);
    const { collapsed, setCollapsed } = useSidebar();

    return <div {...props} className={classes(style.wrapper, props.className)}>
        <Halo disabled={!collapsed} color="var(--f-clr-primary-300)">
            <button type="button" className={style.toggle} onClick={() => setCollapsed(false)} disabled={!collapsed}>
                <div className={style.logo}>
                    {children}
                </div>

                <div className={style.icon}>
                    <Icon type="right" />
                </div>
            </button>
        </Halo>

        <Button size="sml" compact variant="light" onClick={() => setCollapsed(true)} className={style.button} tabIndex={collapsed ? -1 : 0} data-collapsed={collapsed}>
            <Icon type="left" />
        </Button>
    </div>;
}

Toggle.displayName = 'Sidebar.Toggle';