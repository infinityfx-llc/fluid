import { forwardRef } from 'react';
import { Halo } from '../feedback';
import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { Animatable } from '@infinityfx/lively';
import { LayoutGroup } from '@infinityfx/lively/layout';
import { classes } from '@/src/core/utils';

const SideLink = forwardRef(({ styles = {}, label, icon, right, active = false, collapsed = false, round = false, variant = 'default', disabled = false, ...props }:
    {
        styles?: FluidStyles;
        label: string;
        icon: React.ReactNode;
        right?: React.ReactNode;
        active?: boolean;
        collapsed?: boolean;
        variant?: 'default' | 'light',
        round?: boolean;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const style = useStyles(styles, {
        '.wrapper': {
            outline: 'none',
            border: 'none',
            background: 'none',
            borderRadius: 'var(--f-radius-sml)',
            color: 'var(--f-clr-text-100)',
            transition: 'background-color .25s, color .25s'
        },

        '.link': {
            position: 'relative',
            fontSize: 'var(--f-font-size-sml)',
            fontWeight: 600,
            borderRadius: 'inherit',
            display: 'flex',
            gap: 'var(--f-spacing-sml)',
            alignItems: 'center',
            paddingInline: '1em',
            height: '3em'
        },

        '.link > *': {
            flexShrink: 0
        },

        '.wrapper:enabled': {
            cursor: 'pointer'
        },

        '.wrapper[data-round="true"]': {
            borderRadius: '999px'
        },

        '.wrapper[data-active="true"]': {
            backgroundColor: 'var(--f-clr-primary-100)',
            color: 'var(--f-clr-text-200)'
        },

        '.wrapper[data-active="true"][data-variant="light"]': {
            backgroundColor: 'var(--f-clr-primary-600)',
            color: 'var(--f-clr-primary-100)'
        },

        '.wrapper:disabled': {
            color: 'var(--f-clr-grey-500)'
        },

        '.content': {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            flexShrink: 1,
        },

        '.right': {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-sml)',
            marginLeft: 'auto'
        }
    });

    return <LayoutGroup transition={{ duration: .25 }}>
        <Animatable cachable={['width']}>

            <button ref={ref} {...props} className={classes(style.wrapper, props.className)} type="button" disabled={disabled} data-variant={variant} data-round={round} data-active={active}>
                <Halo color="var(--f-clr-primary-200)" disabled={disabled}>
                    <div className={style.link}>
                        {icon}

                        {!collapsed && <Animatable key="1" cachable={[]} noInherit animate={{ opacity: [0, 1], duration: .25 }} initial={{ opacity: collapsed ? 0 : 1 }} unmount triggers={[{ on: collapsed }]}>
                            <span className={style.content}>{label}</span>
                        </Animatable>}

                        {!collapsed && right && <Animatable key="2" cachable={[]} noInherit animate={{ opacity: [0, 1], duration: .25 }} initial={{ opacity: collapsed ? 0 : 1 }} unmount triggers={[{ on: collapsed }]}>
                            <span className={style.right}>
                                {right}
                            </span>
                        </Animatable>}
                    </div>
                </Halo>
            </button>
        </Animatable>
    </LayoutGroup>;
});

SideLink.displayName = 'SideLink';

export default SideLink;