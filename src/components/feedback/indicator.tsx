'use client';

import { classes, combineClasses, combineRefs } from "../../../src/core/utils";
import { FluidStyles, Selectors } from "../../../src/types";
import { Children, cloneElement, forwardRef, isValidElement } from "react";
import { createStyles } from "../../core/style";

// fix cloneElement issues!!

export type IndicatorStyles = FluidStyles<'.indicator' | '.indicator__round'>;

const Indicator = forwardRef(<T extends React.ReactElement>({ children, cc = {}, content, color, outline, round, ...props }:
    {
        children: T;
        cc?: Selectors<'indicator' | 'indicator__round'>;
        content?: number | string | boolean;
        color?: string;
        outline?: string;
        round?: boolean;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'content'>, ref: React.ForwardedRef<T>) => {
    const styles = createStyles('indicator', {
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

        '.indicator__round': {
            top: '14%',
            right: '14%'
        }
    });
    const style = combineClasses(styles, cc);

    children = Array.isArray(children) ? children[0] : children;
    if (!isValidElement(children)) return children;

    const arr = Children.toArray(children.props.children);
    if (content !== false) arr.push(<div {...props}
        key="indicator"
        className={classes(
            style.indicator,
            round && style.indicator__round,
            props.className
        )}
        style={{
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