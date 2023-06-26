'use client';

import useStyles from '@/src/hooks/use-styles';
import { FluidSize, FluidStyles } from '@/src/types';
import { forwardRef, useState } from 'react';
import Toggle from '../../input/toggle';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import Scrollarea from '../scrollarea';
import useFluid from '@/src/hooks/use-fluid';
import { classes } from '@/src/core/utils';

const Root = forwardRef(({ children, styles = {}, header = 'med', collapsed, onCollapse, ...props }:
    {
        styles?: FluidStyles;
        header?: FluidSize;
        collapsed?: boolean;
        onCollapse?: (value: boolean) => void;
    } & React.HTMLAttributes<HTMLElement>, ref: React.ForwardedRef<HTMLElement>) => {
    const fluid = useFluid();
    const [isCollapsed, setCollapsed] = collapsed !== undefined ? [collapsed] : useState(false);

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
            height: `var(--f-header-${header})`,
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

        [`@media (max-width: ${fluid.breakpoints.tab}px)`]: {
            '.sidebar[data-collapsed="true"]': {
                translate: '-100% 0%'
            }
        },
    });

    return <aside ref={ref} {...props} className={classes(style.sidebar, props.className)} data-collapsed={isCollapsed}>
        <div className={style.header}>
            <Toggle variant="mono" checkedContent={<MdArrowBack />} checked={!isCollapsed} onChange={e => {
                setCollapsed?.(!e.target.checked);
                onCollapse?.(!e.target.checked);
            }} className={style.button}>
                <MdArrowForward />
            </Toggle>
        </div>

        <Scrollarea style={{ flexGrow: 1 }}>
            <div className={style.content}>
                {children}
            </div>
        </Scrollarea>
    </aside>;
});

Root.displayName = 'Sidebar.Root';

export default Root;