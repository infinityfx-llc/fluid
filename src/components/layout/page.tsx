import useStyles from '@/src/hooks/use-styles';
import { FluidSize, FluidStyles } from '@/src/types';
import { Children, cloneElement, isValidElement, useState } from 'react';
import Header, { HeaderProps } from './header';
import Sidebar, { SidebarProps } from './sidebar';

export default function Page({ styles = {}, children, width = 'med' }: { styles?: FluidStyles; width?: FluidSize; } & React.HTMLAttributes<any>) {
    let header: FluidSize | null = null, hasSidebar = false;
    Children.forEach(children, child => {
        if (!isValidElement(child)) return;

        if (child.type === Header && child.props.variant !== 'transparent') header = child.props.size || 'med';
        if (child.type === Sidebar) hasSidebar = true;
    });

    const style = useStyles(styles, {
        '.content': {
            paddingRight: `var(--f-page-${width})`,
            paddingTop: header ? `var(--f-header-${header})` : undefined,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            transition: 'padding-left .3s'
        }
    });

    const [collapsed, setCollapsed] = useState(false);
    const sidebar = hasSidebar && !collapsed;

    return <main className={style.content} style={{ paddingLeft: sidebar ? `calc(var(--f-sidebar) + var(--f-spacing-lrg))` : `var(--f-page-${width})` }}>
        {Children.map(children, child => {
            if (!isValidElement(child)) return child;

            if (child.type === Header) return cloneElement(child as React.ReactElement<HeaderProps>, { width, sidebar });
            if (child.type === Sidebar) return cloneElement(child as React.ReactElement<SidebarProps>, { collapsed, onCollapse: setCollapsed });

            return child;
        })}
    </main>;
}