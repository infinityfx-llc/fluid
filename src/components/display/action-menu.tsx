'use client';

import { classes } from '@/src/core/utils';
import useStyles from '@/src/hooks/use-styles';
import { FluidStyles, PopoverRootReference } from '@/src/types';
import { Animate } from '@infinityfx/lively';
import { Move, Pop } from '@infinityfx/lively/animations';
import { forwardRef, useCallback, useRef, useId } from 'react';
import Halo from '../feedback/halo';
import Popover from '../layout/popover';
import { MdChevronRight } from 'react-icons/md';

export type ActionMenuOption = {
    type: 'option';
    label: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    shouldClose?: boolean;
    options?: ActionMenuOption[];
} | {
    type: 'heading';
    text: string;
} | {
    type: 'divider'
};

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
            border: 'solid 1px var(--f-clr-fg-200)',
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

        '.heading': {
            padding: '.5rem .8rem .3rem .8rem',
            fontWeight: 700,
            fontSize: '.85em',
            color: 'var(--f-clr-text-100)'
        },

        '.divider': {
            height: '1px',
            width: '100%',
            backgroundColor: 'var(--f-clr-grey-100)',
            marginBlock: '.3em'
        },

        '.submenu': {
            position: 'absolute',
            left: '100%',
            top: 'calc(-1px - .3em)',
            opacity: 0,
            visibility: 'hidden',
            translate: '-12px 0',
            transition: 'opacity .2s, visibility .2s, translate .2s'
        },

        '.wrapper': {
            position: 'relative'
        },

        '.wrapper[data-disabled="false"]:hover > .submenu': {
            opacity: 1,
            visibility: 'visible',
            translate: '0 0'
        }
    });

    const getOption = useCallback((option: ActionMenuOption, i: number) => {
        if (option.type === 'heading') return <div key={i} className={style.heading}>{option.text}</div>;
        if (option.type === 'divider') return <div key={i} className={style.divider} role="separator" />;

        const { label, onClick, disabled = false, shouldClose = true, options } = option;
        return <div key={i} className={style.wrapper} data-disabled={disabled}>
            <Halo disabled={disabled}>
                <button role="menuitem" className={style.option} disabled={disabled} onClick={() => {
                    if (shouldClose) popover.current?.close();
                    onClick?.();
                }}>
                    {label}

                    {options && <MdChevronRight style={{ marginLeft: 'auto' }} />}
                </button>
            </Halo>

            {options && <div role="group" className={classes(style.submenu, style.menu)}>
                {options.map(getOption)}
            </div>}
        </div>;
    }, []);

    const id = useId();
    const popover = useRef<PopoverRootReference>(null);

    return <Popover.Root ref={popover} stretch={stretch}>
        <Popover.Trigger disabled={disabled} aria-haspopup="menu" id={id}>
            {children}
        </Popover.Trigger>

        <Popover.Content role="menu" aria-labelledby={id}>
            <Animate key="menu" animations={[Move.unique({ duration: .2 }), Pop.unique({ duration: .2 })]} unmount triggers={[{ on: 'mount' }]} levels={2} stagger={.06}>
                <div ref={ref} {...props} className={classes(style.menu, props.className)} role="group">
                    {options.map(getOption)}
                </div>
            </Animate>
        </Popover.Content>
    </Popover.Root>
});

ActionMenu.displayName = 'ActionMenu';

export default ActionMenu;