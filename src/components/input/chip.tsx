import { classes } from '@/src/core/utils';
import useInputProps from '@/src/hooks/use-input-props';
import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { forwardRef } from 'react';

const Chip = forwardRef(({ children, styles = {}, round = false, ...props }: { children: React.ReactNode; styles?: FluidStyles; round?: boolean; } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>, ref: React.ForwardedRef<HTMLLabelElement>) => {
    const style = useStyles(styles, {
        '.input': {
            position: 'absolute',
            opacity: 0
        },

        '.chip': {
            backgroundColor: 'var(--f-clr-fg-100)',
            fontSize: 'var(--f-font-size-xsm)',
            color: 'var(--f-clr-text-100)',
            fontWeight: 600,
            padding: '.5em .8em',
            borderRadius: 'var(--f-radius-sml)',
            userSelect: 'none',
            transition: 'background-color .15s'
        },

        '.wrapper[data-round="true"] .chip': {
            borderRadius: '999px'
        },

        '.content': {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xsm)'
        },

        '.dot': {
            width: '.7em',
            height: '.7em',
            borderRadius: '999px',
            backgroundColor: 'var(--f-clr-bg-100)',
            transition: 'background-color .15s'
        },

        '.input:checked + .chip .dot': {
            backgroundColor: 'var(--f-clr-text-100)'
        },
        
        '.input:enabled + .chip': {
            cursor: 'pointer'
        },

        '.input:checked + .chip': {
            backgroundColor: 'var(--f-clr-primary-100)'
        },

        '.input:focus-visible + .chip': {
            backgroundColor: 'var(--f-clr-primary-500)'
        },

        '.input:checked:focus-visible + .chip': {
            backgroundColor: 'var(--f-clr-primary-300)'
        },

        '.input:disabled + .chip': {
            color: 'var(--f-clr-grey-500)'
        },

        '.input:checked:disabled + .chip': {
            color: 'var(--f-clr-grey-100)',
            backgroundColor: 'var(--f-clr-grey-300)'
        },

        '.input:disabled + .chip .dot': {
            backgroundColor: 'var(--f-clr-grey-100)'
        }
    });

    const [split, rest] = useInputProps(props);

    return <label ref={ref} {...rest} className={classes(style.wrapper, rest.className)} data-round={round}>
        <input {...split} type="checkbox" className={style.input} />

        <div className={style.chip}>
            <span className={style.content}>
                <div className={style.dot} />

                {children}
            </span>
        </div>
    </label>;
});

Chip.displayName = 'Chip';

export default Chip;