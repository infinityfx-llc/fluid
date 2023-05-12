import { classes, combineRefs } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { Animatable } from "@infinityfx/lively";
import { useTrigger } from "@infinityfx/lively/hooks";
import { Children, cloneElement, forwardRef, isValidElement } from "react";

const Halo = forwardRef(<T extends React.ReactElement>({ children, color, hover = true, disabled = false, className, style, ...props }: { children: T; color?: string; hover?: boolean; disabled?: boolean; } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: React.ForwardedRef<T>) => {
    const _style = useStyles({
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
            justifyContent: 'center',
            pointerEvents: 'none'
        },

        '@media (pointer: fine)': {
            '.container:hover .halo[data-hover="true"]': {
                opacity: .25
            }
        },

        '@media (pointer: coarse)': {
            '.container:active .halo': {
                opacity: .25
            }
        },

        '.container:focus-visible .halo, .container:has(:focus-visible) .halo': {
            opacity: .25
        },

        '@supports not selector(:focus-visible)': {
            '.container:focus-within .halo': {
                opacity: .25
            }
        },

        '.circle': {
            minWidth: '141%',
            minHeight: '141%',
            aspectRatio: 1,
            backgroundColor: 'var(--f-clr-grey-500)',
            borderRadius: '999px',
            zIndex: -1
        }
    });

    const click = useTrigger();

    children = Array.isArray(children) ? children[0] : children;
    if (!isValidElement(children)) return children;

    const arr = Children.toArray(children.props.children);
    arr.unshift(<div key="halo" className={classes(_style.halo, className)} style={style} data-hover={hover}>
        <Animatable animate={{ opacity: [0, 1], scale: [0, 1], duration: .4, easing: 'linear' }} initial={{ opacity: 1, scale: 1 }} triggers={[{ on: click, immediate: true }]}>
            <div className={_style.circle} style={{ backgroundColor: color }} />
        </Animatable>
    </div>);

    return cloneElement(children, {
        ...props,
        ref: combineRefs(ref, (children as any).ref),
        className: classes(children.props.className, _style.container),
        onClick: (e: any) => {
            children.props.onClick?.(e);
            props.onClick?.(e);
            click();
        }
    }, arr);
});

Halo.displayName = 'Halo';

export default Halo;