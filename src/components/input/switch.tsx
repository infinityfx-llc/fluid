import { classes } from '@/src/core/utils';
import useStyles from '@/src/hooks/use-styles';
import { FluidError, FluidStyles } from '@/src/types';
import { forwardRef } from 'react';
import Halo from '../feedback/halo';

const Switch = forwardRef(({ styles = {}, error, round = false, className, style, ...props }: { styles?: FluidStyles; error?: FluidError; round?: boolean; disabled?: boolean; checked?: boolean; } & React.InputHTMLAttributes<HTMLInputElement>, ref: React.ForwardedRef<HTMLLabelElement>) => {
    const _style = useStyles(styles, {
        '.wrapper': {
            position: 'relative'
        },
        
        '.input': {
            position: 'absolute',
            opacity: 0
        },

        '.switch': {
            position: 'relative',
            height: '1.6em',
            width: '2.8em',
            padding: '.2em',
            aspectRatio: 2,
            backgroundColor: 'var(--f-clr-fg-100)',
            borderRadius: 'var(--f-radius-sml)',
            transition: 'background-color .25s'
        },

        '.handle': {
            borderRadius: 'var(--f-radius-sml)',
            height: '100%',
            aspectRatio: 1,
            backgroundColor: 'var(--f-clr-text-200)',
            transition: 'translate .25s'
        },

        '.input:checked:enabled + .switch': {
            backgroundColor: 'var(--f-clr-primary-300)'
        },

        '.input:checked + .switch .handle': {
            translate: '100% 0%'
        },

        '.input:enabled + .switch': {
            cursor: 'pointer'
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

    return <Halo className={_style.halo} hover={false}>
        <label ref={ref} className={classes(_style.wrapper, className)} style={style} data-round={round} data-error={!!error}>
            <input {...props} type="checkbox" className={_style.input} />

            <div className={_style.switch}>
                <div className={_style.handle} />
            </div>
        </label>
    </Halo>;
});

Switch.displayName = 'Switch';

export default Switch;