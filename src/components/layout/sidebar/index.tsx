import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { forwardRef, useState } from 'react';
import Link from './link';
import { Toggle } from '../../input';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import Heading from './heading';
import User from './user';
import Scrollarea from '../scrollarea';
import useFluid from '@/src/hooks/use-fluid';
import useLayout from '@/src/hooks/use-layout';

export type SidebarProps = {
    styles?: FluidStyles;
} & React.HTMLAttributes<HTMLElement>;

const Sidebar: React.ForwardRefExoticComponent<SidebarProps> & {
    Link: typeof Link;
    Heading: typeof Heading;
    User: typeof User;
} = forwardRef(({ children, styles = {}, ...props }: SidebarProps, ref: React.ForwardedRef<HTMLElement>) => {
    const fluid = useFluid();
    const [isCollapsed, setCollapsed] = useState(false);
    const { header } = useLayout({ sidebar: true, collapsed: isCollapsed });

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
            boxShadow: '0 0 12px rgb(0, 0, 0, .05)',
            borderRight: 'solid 1px var(--f-clr-grey-100)',
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '1em',
            width: 'var(--f-sidebar)',
            transition: 'width .3s, translate .3s'
        },

        '.sidebar[data-collapsed="true"]': {
            width: 'calc(3rem + 2em)'
        },

        '.button': {
            marginLeft: 'auto'
        },

        '.header': {
            height: `var(--f-header-${header || 'sml'})`,
            display: 'flex',
            alignItems: 'center',
            paddingInline: '1em'
        },

        '.content': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xsm)',
            padding: '0 1em',
            minHeight: '100%',
            overflow: 'hidden'
        },

        [`@media (max-width: ${fluid.breakpoints[1]}px)`]: {
            '.sidebar[data-collapsed="true"]': {
                translate: '-100% 0%'
            }
        },
    });

    return <aside ref={ref} {...props} className={style.sidebar} data-collapsed={isCollapsed}>
        <div className={style.header}>
            <Toggle variant="mono" checkedContent={<MdArrowBack />} checked={!isCollapsed} onChange={e => setCollapsed(!e.target.checked)} className={style.button}>
                <MdArrowForward />
            </Toggle>
        </div>

        <Scrollarea style={{ flexGrow: 1 }}>
            <div className={style.content}>
                {children}
            </div>
        </Scrollarea>
    </aside>;
}) as any;

Sidebar.Link = Link;
Sidebar.Heading = Heading;
Sidebar.User = User;
Sidebar.displayName = 'Sidebar';

export default Sidebar;