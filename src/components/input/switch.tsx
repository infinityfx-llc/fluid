import { classes } from '@/src/core/utils';
import useStyles from '@/src/hooks/use-styles';
import { FluidError, FluidSize, FluidStyles } from '@/src/types';
import { forwardRef } from 'react';
import Halo from '../feedback/halo';
import useInputProps from '@/src/hooks/use-input-props';

const Switch = forwardRef(({ styles = {}, error, size = 'med', color = 'var(--f-clr-primary-300)', round = true, iconOff, iconOn, ...props }:
    {
        styles?: FluidStyles;
        error?: FluidError;
        size?: FluidSize;
        color?: string;
        round?: boolean;
        iconOff?: React.ReactNode;
        iconOn?: React.ReactNode;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.wrapper': {
            position: 'relative'
        },

        '.wrapper[data-size="xsm"]': {
            fontSize: 'var(--f-font-size-xxs)'
        },

        '.wrapper[data-size="sml"]': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.wrapper[data-size="med"]': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.wrapper[data-size="lrg"]': {
            fontSize: 'var(--f-font-size-med)'
        },

        '.input': {
            position: 'absolute',
            opacity: 0,
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 2
        },

        '.input:enabled': {
            cursor: 'pointer'
        },

        '.switch': {
            position: 'relative',
            height: '1.5em',
            width: 'calc(calc(1.5em - 6px) * 2 + 6px)',
            padding: '3px',
            aspectRatio: 2,
            backgroundColor: 'var(--f-clr-fg-100)',
            borderRadius: 'var(--f-radius-sml)',
            transition: 'background-color .25s'
        },

        '.icons': {
            position: 'absolute',
            inset: 0,
            display: 'flex'
        },

        '.icon': {
            flexGrow: 1,
            flexBasis: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '.75em'
        },

        '.icon:first-child': {
            color: 'white'
        },

        '.icon:last-child': {
            color: 'var(--f-clr-grey-400)'
        },

        '.handle': {
            position: 'relative',
            borderRadius: 'calc(var(--f-radius-sml) - 1px)',
            height: '100%',
            aspectRatio: 1,
            backgroundColor: 'white',
            transition: 'translate .25s',
            zIndex: 1,
            boxShadow: '0 0 6px rgb(0, 0, 0, .06)'
        },

        '.input:checked:enabled + .switch': {
            backgroundColor: color
        },

        '.input:checked + .switch .handle': {
            translate: '100% 0%'
        },

        '.wrapper[data-round="true"] .switch': {
            borderRadius: '999px'
        },

        '.wrapper[data-round="true"] .handle': {
            borderRadius: '999px'
        },

        '.wrapper[data-error="true"] .input:enabled + .switch': {
            backgroundColor: 'var(--f-clr-error-400)'
        },

        '.wrapper[data-error="true"] .input:checked:enabled + .switch': {
            backgroundColor: 'var(--f-clr-error-200)'
        },

        '.input:disabled + .switch .handle': {
            backgroundColor: 'var(--f-clr-grey-200)'
        },

        '.halo': {
            borderRadius: 'var(--f-radius-sml)',
            inset: '-.5em'
        },

        '.wrapper[data-round="true"] .halo': {
            borderRadius: '999px'
        }
    });

    const [split, rest] = useInputProps(props);

    return <Halo className={style.halo} hover={false}>
        <div ref={ref} {...rest} className={classes(style.wrapper, rest.className)} data-size={size} data-round={round} data-error={!!error}>
            <input {...split} type="checkbox" className={style.input} aria-invalid={!!error} />

            <div className={style.switch}>
                <div className={style.icons}>
                    <div className={style.icon}>
                        {iconOn}
                    </div>

                    <div className={style.icon}>
                        {iconOff}
                    </div>
                </div>

                <div className={style.handle} />
            </div>
        </div>
    </Halo>;
});

Switch.displayName = 'Switch';

export default Switch;