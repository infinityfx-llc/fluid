import { classes, combineRefs } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { Children, cloneElement, forwardRef, isValidElement } from "react";

const Indicator = forwardRef(<T extends React.ReactElement>({ children, styles = {}, content, color, outline, round, ...props }: { children: T; styles?: FluidStyles; content?: number | string | boolean; color?: string; outline?: string; round?: boolean; } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'content'>, ref: React.ForwardedRef<T>) => {
    const style = useStyles(styles, {
        '.indicator': {
            position: 'absolute',
            top: 0,
            right: 0,
            minWidth: '1.4em',
            minHeight: '1.4em',
            borderRadius: '99px',
            backgroundColor: 'var(--f-clr-accent-100)',
            border: 'solid 2px transparent',
            translate: '50% -50%',
            pointerEvents: 'none',
            fontSize: 'var(--f-font-size-xxs)',
            fontWeight: 600,
            color: 'var(--f-clr-text-200)',
            padding: '.1em .4em',
            zIndex: 99
        },

        '.indicator[data-round="true"]': {
            top: '14%',
            right: '14%'
        }
    });

    children = Array.isArray(children) ? children[0] : children;
    if (!isValidElement(children)) return children;

    const arr = Children.toArray(children.props.children);
    if (content !== false) arr.push(<div {...props} key="indicator" className={classes(style.indicator, props.className)} data-round={round} style={{
        ...props.style,
        backgroundColor: color,
        borderColor: outline
    }}>
        {typeof content !== 'boolean' ? content : null}
    </div>);

    return cloneElement(children, {
        ref: combineRefs(ref, (children as any).ref)
    }, arr);
});

Indicator.displayName = 'Indicator';

export default Indicator;