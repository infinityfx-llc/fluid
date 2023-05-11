import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { forwardRef, useState } from "react";
import Halo from "../feedback/halo";
import useInputProps from "@/src/hooks/use-input-props";
import { useTrigger } from "@infinityfx/lively/hooks";
import { Animatable } from "@infinityfx/lively";
import useUpdate from "@/src/hooks/use-update";

const Toggle = forwardRef(({ children, styles = {}, round = false, variant = 'default', alternate, ...props }: { children: React.ReactNode; styles?: FluidStyles; round?: boolean; variant?: 'default' | 'minimal'; alternate?: React.ReactNode; } & React.InputHTMLAttributes<HTMLInputElement>, ref: React.ForwardedRef<HTMLLabelElement>) => {
    const style = useStyles(styles, {
        '.input': {
            position: 'absolute',
            opacity: 0
        },

        '.toggle': {
            position: 'relative',
            backgroundColor: 'var(--f-clr-fg-100)',
            color: 'var(--f-clr-text-100)',
            padding: '.5em',
            borderRadius: 'var(--f-radius-sml)',
            fontSize: 'var(--f-font-size-sml)',
            transition: 'background-color .25s, color .25s'
        },

        '.toggle[data-variant="minimal"]': {
            backgroundColor: 'transparent'
        },

        '.toggle[data-disabled="false"]': {
            cursor: 'pointer'
        },

        '.content': {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            justifyContent: 'center',
            gap: 'var(--f-spacing-xsm)'
        },

        '.toggle[data-checked="true"]': {
            backgroundColor: 'var(--f-clr-primary-100)',
            color: 'var(--f-clr-text-200)'
        },

        '.toggle[data-checked="false"][data-disabled="true"]': {
            color: 'var(--f-clr-grey-500)'
        },

        '.toggle[data-checked="true"][data-disabled="true"]': {
            backgroundColor: 'var(--f-clr-grey-300)',
            color: 'var(--f-clr-grey-100)'
        },

        '.toggle[data-round="true"]': {
            borderRadius: '999px'
        }
    });

    const [state, setState] = props.checked !== undefined ? [props.checked] : useState(!!props.defaultChecked);
    const [split, rest] = useInputProps(props);
    const check = useTrigger();
    const uncheck = useTrigger();
    const triggers = [{ on: check, immediate: true }, { on: uncheck, reverse: true, immediate: true }];

    useUpdate(() => state ? check() : uncheck(), [state]);

    return <Halo disabled={props.disabled}>
        <label ref={ref} {...rest} className={style.toggle} data-checked={state} data-disabled={!!props.disabled} data-round={round} data-variant={variant}>
            <input {...split} type="checkbox" className={style.input} onChange={e => {
                setState?.(e.target.checked);
                split.onChange?.(e);
            }} />

            <span className={style.content}>
                {alternate ? <Animatable
                    animate={{ translate: ['0 0', '0 105%'], duration: .4 }}
                    initial={{ translate: state ? '0 105%' : '0 0' }}
                    triggers={triggers}>
                    <span className={style.content}>{children}</span>
                </Animatable> : children}

                {alternate ? <Animatable
                    animate={{ translate: ['0 -105%', '0 0'], duration: .4 }}
                    initial={{ translate: state ? '0 0' : '0 -105%' }}
                    triggers={triggers}>
                    <span className={style.content} style={{ position: 'absolute' }}>{alternate}</span>
                </Animatable> : null}
            </span>
        </label>
    </Halo>;
});

Toggle.displayName = 'Toggle';

export default Toggle;