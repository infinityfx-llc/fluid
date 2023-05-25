import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { forwardRef, useState } from 'react';
import Link from './link';
import { Button } from '../../input';
import { MdArrowBack } from 'react-icons/md';
import Heading from './heading';
import { LayoutGroup } from '@infinityfx/lively/layout';
import User from './user';

type SidebarProps = {
    styles?: FluidStyles;
    collapsed?: boolean;
} & React.HTMLAttributes<HTMLElement>;

const Sidebar: React.ForwardRefExoticComponent<SidebarProps> & {
    Link: typeof Link;
    Heading: typeof Heading;
    User: typeof User;
} = forwardRef(({ children, styles = {}, ...props }: SidebarProps, ref: React.ForwardedRef<HTMLElement>) => {
    const style = useStyles(styles, {
        '.sidebar': {
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            zIndex: 500,
            backgroundColor: 'var(--f-clr-bg-100)',
            borderTopRightRadius: 'var(--f-radius-lrg)',
            borderBottomRightRadius: 'var(--f-radius-lrg)',
            boxShadow: '0 0 12px rgb(0, 0, 0, .06)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1em 0',
            width: '16rem',
            transition: 'width .3s'
        },

        '.sidebar[data-collapsed="true"]': {
            width: 'calc(3rem + 2em)'
        },

        '.button': {
            translate: '50% 0%',
            marginLeft: 'auto'
        },

        '.content': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xsm)',
            padding: '0 1em',
            flexGrow: 1,
            overflow: 'hidden'
        }
    });

    const [collapsed, setCollapsed] = useState(false);

    return <LayoutGroup>
        <aside ref={ref} {...props} className={style.sidebar} data-collapsed={collapsed}>
            <div className={style.header}>
                <Button variant="light" onClick={() => setCollapsed(!collapsed)} className={style.button}>
                    <MdArrowBack />
                </Button>
            </div>

            <div className={style.content}>
                {children}
            </div>
        </aside>
    </LayoutGroup>;
}) as any;

Sidebar.Link = Link;
Sidebar.Heading = Heading;
Sidebar.User = User;
Sidebar.displayName = 'Sidebar';

export default Sidebar;