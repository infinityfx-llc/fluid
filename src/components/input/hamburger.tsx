import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { forwardRef } from "react";
import Halo from "../feedback/halo";
import { Animatable } from "@infinityfx/lively";
import { useTrigger } from "@infinityfx/lively/hooks";

const Hamburger = forwardRef(({ styles = {}, ...props }: { styles?: FluidStyles; } & React.ButtonHTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const style = useStyles(styles, {
        '.hamburger': {
            position: 'relative',
            border: 'none',
            background: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '2.2em',
            padding: '.5em',
            borderRadius: 'var(--f-radius-sml)',
            outline: 'none'
        },

        '.line': {
            width: '1.6em',
            height: '3px',
            backgroundColor: 'var(--f-clr-text-100)',
            transformOrigin: 'bottom right',
            borderRadius: '99px'
        },

        '.hamburger:enabled': {
            cursor: 'pointer'
        },

        '.hamburger:disabled .line': {
            backgroundColor: 'var(--f-clr-grey-400)'
        },

        '.cross': {
            top: 0,
            position: 'absolute',
            rotate: '-45deg',
            height: '100%',
            width: '1.7em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },

        '.cross > *': {
            position: 'absolute',
            width: '100%'
        },

        '.cross > *:last-child': {
            height: '1.7em',
            width: '3px'
        }
    });
    const open = useTrigger();
    const close = useTrigger();

    return <Halo disabled={props.disabled}>
        <button ref={ref} {...props} className={style.hamburger} onClick={() => {
            open.value > close.value ? close() : open();
        }}>
            <Animatable animate={{ scale: ['1 1', '0 1', '0 1'], duration: .6 }} deform={false} triggers={[
                { on: open, immediate: true },
                { on: close, reverse: true, immediate: true }
            ]}>
                {new Array(3).fill(0).map((_, i) => {
                    return <div key={i} className={style.line} />
                })}
            </Animatable>

            <div className={style.cross}>
                <Animatable animate={{ scale: ['0 1', '0 1', '1 1'], duration: .6 }} deform={false} triggers={[
                    { on: open, immediate: true },
                    { on: close, reverse: true, immediate: true }
                ]}>
                    <div className={style.line} />
                </Animatable>
                <Animatable animate={{ scale: ['1 0', '1 0', '1 1'], duration: .6, delay: .2 }} deform={false} triggers={[
                    { on: open, immediate: true },
                    { on: close, reverse: true, immediate: true }
                ]}>
                    <div className={style.line} />
                </Animatable>
            </div>
        </button>
    </Halo>;
});

Hamburger.displayName = 'Hamburger';

export default Hamburger;