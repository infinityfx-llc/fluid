'use client';

import { classes } from '@/src/core/utils';
import useStyles from '@/src/hooks/use-styles';
import { FluidStyles, PopoverRootReference } from '@/src/types';
import { Animate } from '@infinityfx/lively';
import { Move, Pop } from '@infinityfx/lively/animations';
import { forwardRef, useRef } from 'react';
import Halo from '../feedback/halo';
import Popover from '../layout/popover';
import { MdChevronRight, MdExpandMore } from 'react-icons/md';

export type ActionMenuOption = {
    label: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    shouldClose?: boolean;
    options?: {
        label: string;
        onClick?: () => void;
        disabled?: boolean;
        shouldClose?: boolean;
    }[];
} | string;

const ActionMenu = forwardRef(({ children, styles = {}, options, disabled, stretch, ...props }: {
    children: React.ReactElement;
    styles?: FluidStyles;
    options: ActionMenuOption[];
    disabled?: boolean;
    stretch?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.menu': {
            padding: '.3em',
            background: 'var(--f-clr-bg-100)',
            border: 'solid 1px var(--f-clr-grey-100)',
            borderRadius: 'calc(.3em + var(--f-radius-sml))',
            boxShadow: '0 0 8px rgb(0, 0, 0, 0.06)',
            fontSize: 'var(--f-font-size-sml)',
            minWidth: 'clamp(0px, 10em, 100vw)',
            width: '100%'
        },

        '.option': {
            position: 'relative',
            padding: '.5rem .8rem',
            border: 'none',
            background: 'none',
            outline: 'none',
            width: '100%',
            borderRadius: 'var(--f-radius-sml)',
            userSelect: 'none',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xsm)',
            color: 'var(--f-clr-text-100)'
        },

        '.option:enabled': {
            cursor: 'pointer'
        },

        '.option:disabled': {
            color: 'var(--f-clr-grey-500)'
        },

        '.title': {
            padding: '.5rem .8rem',
            fontWeight: 700,
            fontSize: '.8em',
            color: 'var(--f-clr-grey-600)'
        },

        '.title:not(:first-child)': {
            borderTop: 'solid 1px var(--f-clr-grey-100)',
            marginTop: '.5em'
        },

        '.submenu': {
            position: 'absolute',
            left: '100%',
            top: 0,
            opacity: 0,
            visibility: 'hidden',
            translate: '-12px 0',
            transition: 'opacity .2s, visibility .2s, translate .2s'
        },

        '.option:enabled:hover > .submenu': {
            opacity: 1,
            visibility: 'visible',
            translate: '0 0'
        }
    });

    const popover = useRef<PopoverRootReference>(null);

    return <Popover.Root ref={popover} stretch={stretch}>
        <Popover.Trigger disabled={disabled}>
            {children}
        </Popover.Trigger>

        <Popover.Content role="menu">
            <Animate key="menu" animations={[Move.unique({ duration: .2 }), Pop.unique({ duration: .2 })]} unmount triggers={[{ on: 'mount' }]} levels={2} stagger={.06}>
                <div ref={ref} {...props} className={classes(style.menu, props.className)}>
                    {options.map((option, i) => {
                        if (typeof option === 'string') return <div key={i} className={style.title}>{option}</div>;

                        const { label, onClick, disabled = false, shouldClose = true, options } = option;
                        return <Halo key={i} disabled={disabled}>
                            <button role="menuitem" className={style.option} disabled={disabled} onClick={() => {
                                if (shouldClose) popover.current?.close();
                                onClick?.();
                            }}>
                                {label}

                                {options && <MdChevronRight style={{ marginLeft: 'auto' }} />}

                                {options && <div className={classes(style.submenu, style.menu)}>
                                    {options.map(({ label, disabled, onClick, shouldClose }, i) => {
                                        return <Halo key={i} disabled={disabled}>
                                            <button className={style.option} disabled={disabled} onClick={e => {
                                                e.stopPropagation();

                                                if (shouldClose) popover.current?.close();
                                                onClick?.();
                                            }}>
                                                {label}
                                            </button>
                                        </Halo>;
                                    })}
                                </div>}
                            </button>
                        </Halo>;
                    })}
                </div>
            </Animate>
        </Popover.Content>
    </Popover.Root>
});

ActionMenu.displayName = 'ActionMenu';

export default ActionMenu;