import { classes } from '@/src/core/utils';
import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { forwardRef } from 'react';

const Switch = forwardRef(({ styles = {}, round = false, className, style, ...props }: { styles?: FluidStyles; round?: boolean; disabled?: boolean; checked?: boolean; } & React.InputHTMLAttributes<HTMLInputElement>, ref: React.ForwardedRef<HTMLLabelElement>) => {
    const _style = useStyles(styles, {
        '.input': {
            position: 'absolute',
            visibility: 'hidden'
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

        '.input:disabled + .switch .handle': {
            backgroundColor: 'var(--f-clr-grey-100)'
        },

        '.wrapper[data-round="true"] .switch': {
            borderRadius: '999px'
        },

        '.wrapper[data-round="true"] .handle': {
            borderRadius: '999px'
        }
    });

    return <label ref={ref} className={classes(_style.wrapper, className)} style={style} data-round={round}>
        <input {...props} type="checkbox" className={_style.input} />

        <div className={_style.switch}>
            <div className={_style.handle} />
        </div>
    </label>;
});

Switch.displayName = 'Switch';

export default Switch;