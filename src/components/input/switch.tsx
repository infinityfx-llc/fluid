import { classes } from '@/src/core/utils';
import useStyles from '@/src/hooks/use-styles';
import { FluidError, FluidStyles } from '@/src/types';
import { forwardRef } from 'react';
import Halo from '../feedback/halo';
import useInputProps from '@/src/hooks/use-input-props';

const Switch = forwardRef(({ styles = {}, error, round = true, iconOff, iconOn, ...props }:
    {
        styles?: FluidStyles; 
        error?: FluidError; 
        round?: boolean;
        iconOff?: React.ReactNode;
        iconOn?: React.ReactNode;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.wrapper': {
            position: 'relative'
        },

        '.input': {
            position: 'absolute',
            opacity: 0,
            inset: 0,
            zIndex: 2
        },

        '.input:enabled': {
            cursor: 'pointer'
        },

        '.switch': {
            position: 'relative',
            height: '1.5em',
            width: '2.6em',
            padding: '.2em',
            aspectRatio: 2,
            backgroundColor: 'var(--f-clr-fg-100)',
            borderRadius: 'var(--f-radius-sml)',
            transition: 'background-color .25s'
        },

        '.icons': {
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            fontSize: '.8em',
            color: 'var(--f-clr-text-100)'
        },

        '.handle': {
            position: 'relative',
            borderRadius: 'var(--f-radius-sml)',
            height: '100%',
            aspectRatio: 1,
            backgroundColor: 'white',
            transition: 'translate .25s',
            zIndex: 1
        },

        '.input:checked:enabled + .switch': {
            backgroundColor: 'var(--f-clr-primary-300)'
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
        <div ref={ref} {...rest} className={classes(style.wrapper, rest.className)} data-round={round} data-error={!!error}>
            <input {...split} type="checkbox" className={style.input} aria-invalid={!!error} />

            <div className={style.switch}>
                <div className={style.icons}>
                    {iconOn}

                    {iconOff}
                </div>

                <div className={style.handle} />
            </div>
        </div>
    </Halo>;
});

Switch.displayName = 'Switch';

export default Switch;