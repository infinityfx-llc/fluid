import { classes, combineClasses } from '../../../src/core/utils';
import { FluidError, FluidSize, FluidStyles, Selectors } from '../../../src/types';
import { forwardRef } from 'react';
import Halo from '../feedback/halo';
import useInputProps from '../../../src/hooks/use-input-props';
import { createStyles } from '../../core/style';

// variant

const Switch = forwardRef(({ cc = {}, error, size = 'med', color = 'var(--f-clr-primary-300)', round = true, iconOff, iconOn, ...props }:
    {
        cc?: Selectors<'wrapper' | 'input' | 'switch' | 'icons' | 'icon' | 'hanlde' | 'wrapper__xsm' | 'wrapper__sml' | 'wrapper__med' | 'wrapper__lrg' | 'wrapper__round' | 'halo'>;
        error?: FluidError;
        size?: FluidSize;
        color?: string;
        round?: boolean;
        iconOff?: React.ReactNode;
        iconOn?: React.ReactNode;
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('switch', {
        '.wrapper': {
            position: 'relative'
        },

        '.wrapper__xsm': {
            fontSize: 'var(--f-font-size-xxs)'
        },

        '.wrapper__sml': {
            fontSize: 'var(--f-font-size-xsm)'
        },

        '.wrapper__med': {
            fontSize: 'var(--f-font-size-sml)'
        },

        '.wrapper__lrg': {
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

        '.input:checked + .switch .handle': {
            translate: '100% 0%'
        },

        '.wrapper__round .switch': {
            borderRadius: '999px'
        },

        '.wrapper__round .handle': {
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

        '.wrapper__round .halo': {
            borderRadius: '999px'
        },

        '.halo': {
            borderRadius: 'var(--f-radius-sml) !important',
            inset: '-.5em !important'
        }
    });
    const style = combineClasses(styles, cc);

    const [split, rest] = useInputProps(props);

    return <Halo hover={false} cc={{ halo: style.halo }}>
        <div ref={ref} {...rest} className={classes(
            style.wrapper,
            style[`wrapper__${size}`],
            round && style.wrapper__round,
            rest.className
        )} data-error={!!error}>
            <input {...split} type="checkbox" className={style.input} aria-invalid={!!error} />

            <div className={style.switch} style={!split.disabled ? { backgroundColor: color } : undefined}> {/* and when checked */}
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