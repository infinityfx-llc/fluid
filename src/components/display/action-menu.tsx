import { classes } from '@/src/core/utils';
import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { Animate } from '@infinityfx/lively';
import { Move, Pop } from '@infinityfx/lively/animations';
import { forwardRef } from 'react';
import { Halo } from '../feedback';
import Popover from '../layout/popover';

const ActionMenu = forwardRef(({ children, styles = {}, options, disabled, ...props }: {
    children: React.ReactElement;
    styles?: FluidStyles;
    options: ({
        label: React.ReactNode;
        onClick?: () => void;
        disabled?: boolean;
        shouldClose?: boolean;
    } | string)[];
    disabled?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.menu': {
            padding: '.3em',
            background: 'var(--f-clr-bg-100)',
            border: 'solid 1px var(--f-clr-grey-100)',
            borderRadius: 'var(--f-radius-sml)',
            boxShadow: '0 0 8px rgb(0, 0, 0, 0.06)',
            fontSize: 'var(--f-font-size-sml)',
            width: 'clamp(0px, 10em, 100vw)'
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
        }
    });

    return <Popover role="menu" disabled={disabled} content={close => <Animate key="menu" animations={[Move.unique({ duration: .2 }), Pop.unique({ duration: .2 })]} unmount triggers={[{ on: 'mount' }]} levels={2} stagger={.06}>
        <div ref={ref} {...props} className={classes(style.menu, props.className)}>
            {options.map((option, i) => {
                if (typeof option === 'string') return <div key={i} className={style.title}>{option}</div>;

                const { label, onClick, disabled = false, shouldClose = true } = option;
                return <div key={i}>
                    <Halo disabled={disabled}>
                        <button role="menuitem" className={style.option} disabled={disabled} onClick={() => {
                            if (shouldClose) close();
                            onClick?.();
                        }}>
                            {label}
                        </button>
                    </Halo>
                </div>;
            })}
        </div>
    </Animate>}>
        {children}
    </Popover>;
});

ActionMenu.displayName = 'ActionMenu';

export default ActionMenu;