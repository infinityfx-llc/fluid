import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { Animatable } from "@infinityfx/lively";
import { useTrigger } from "@infinityfx/lively/hooks";
import { Children, cloneElement } from "react";

export default function Halo({ children, color = 'var(--f-clr-grey-500)', disabled = false }: { children: React.ReactElement; color?: string; disabled?: boolean; }) {
    const style = useStyles({
        '.container': {
            zIndex: 0
        },

        '.halo': {
            position: 'absolute',
            overflow: 'hidden',
            borderRadius: 'inherit',
            inset: 0,
            opacity: 0,
            zIndex: -1,
            transition: 'opacity .25s, scale .25s',
            display: disabled ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },

        '@media (pointer: fine)': {
            '.container:hover .halo': {
                opacity: .25
            }
        },

        '@media (pointer: coarse)': {
            '.container:active .halo': {
                opacity: .25
            }
        },

        '.container:focus-visible .halo': {
            opacity: .25
        },

        '.circle': {
            minWidth: '141%',
            minHeight: '141%',
            aspectRatio: 1,
            backgroundColor: color,
            borderRadius: '999px',
            zIndex: -1
        }
    });

    const click = useTrigger();

    const arr = Children.toArray(children.props.children);
    arr.unshift(<div key="halo" className={style.halo}>
        <Animatable key="halo" animate={{ opacity: [0, 1], scale: [0, 1], duration: .4 }} initial={{ opacity: 1, scale: 1 }} triggers={[{ on: click, immediate: true }]}>
            <div className={style.circle} />
        </Animatable>
    </div>);

    return cloneElement(children, {
        className: classes(children.props.className, style.container),
        onClick: (e: any) => {
            children.props.onClick?.(e);
            click();
        }
    }, arr);
}