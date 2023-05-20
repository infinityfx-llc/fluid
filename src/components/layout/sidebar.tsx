import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { forwardRef } from 'react';

const Sidebar = forwardRef(({ children, styles = {}, links, ...props }: { styles?: FluidStyles; links?: any } & React.HTMLAttributes<HTMLElement>, ref: any) => {
    const style = useStyles(styles, {
        '.sidebar': {
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '16em',
            zIndex: 500,
            backgroundColor: 'var(--f-clr-fg-100)',
            borderTopRightRadius: 'var(--f-radius-lrg)',
            borderBottomRightRadius: 'var(--f-radius-lrg)',
            boxShadow: '0 0 12px rgb(0, 0, 0, .06)'
        }
    });

    return <aside {...props} className={style.sidebar}>
        {children}
    </aside>;
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;