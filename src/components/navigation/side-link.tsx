import { forwardRef } from 'react';
import { Halo } from '../feedback';
import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { Animatable } from '@infinityfx/lively';
import { useTrigger } from '@infinityfx/lively/hooks';
import useUpdate from '@/src/hooks/use-update';
import { LayoutGroup } from '@infinityfx/lively/layout';

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
        '.link': {
            position: 'relative',
            fontSize: 'var(--f-font-size-sml)',
            fontWeight: 600,
            outline: 'none',
            border: 'none',
            background: 'none',
            borderRadius: 'var(--f-radius-sml)',
            color: 'var(--f-clr-text-100)',
            display: 'flex',
            gap: 'var(--f-spacing-sml)',
            alignItems: 'center',
            paddingInline: '1em',
            height: '3em'
        },

        '.link > *': {
            flexShrink: 0
        },

        '.link:enabled': {
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

        '.link:disabled': {
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

    // const expand = useTrigger();
    // useUpdate(() => { !collapsed && expand() }, [collapsed]);

    return <LayoutGroup transition={{ duration: .25 }}>
        <Animatable cachable={['width']}>
            {/* <Halo color="var(--f-clr-primary-200)" disabled={disabled}> */}
                <button ref={ref} {...props} className={style.link} type="button" data-variant={variant} data-round={round} data-active={active} disabled={disabled}>
                    {icon}

                    {!collapsed && <Animatable key="1" noInherit animate={{ opacity: [0, 1], duration: .25 }} initial={{ opacity: collapsed ? 0 : 1 }} unmount triggers={[{ on: collapsed }]}>
                        <span className={style.content}>{label}</span>
                    </Animatable>}

                    {!collapsed && right && <Animatable key="2" noInherit animate={{ opacity: [0, 1], duration: .25 }} initial={{ opacity: collapsed ? 0 : 1 }} unmount triggers={[{ on: collapsed }]}>
                        <span className={style.right}>
                            {right}
                        </span>
                    </Animatable>}
                </button>
            {/* </Halo> */}
        </Animatable>
    </LayoutGroup>;
});

SideLink.displayName = 'SideLink';

export default SideLink;