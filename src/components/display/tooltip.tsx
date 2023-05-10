import { classes, combineRefs } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { forwardRef, cloneElement, useState, useRef } from "react";

const Tooltip = forwardRef(({ children, content, styles = {}, ...props }: { children: React.ReactElement; content?: React.ReactNode; styles?: FluidStyles; } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.tooltip': {
            position: 'fixed',
            backgroundColor: 'var(--f-clr-grey-800)',
            color: 'var(--f-clr-text-200)',
            fontSize: 'var(--f-font-size-xsm)',
            padding: '.2em .3em',
            borderRadius: 'var(--f-radius-sml)',
            pointerEvents: 'none',
            zIndex: 999,
            opacity: 0,
            translate: '0px .2em',
            transition: 'translate .2s, opacity .2s, visibility .2s'
        },

        '.tooltip[data-visible="true"]': {
            opacity: 1,
            translate: '0px 0px'
        }
    });

    const element = useRef<HTMLElement | null>(null);
    const tooltip = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState<{ left: string; top: string; visibility: 'hidden' | 'visible'; }>({ left: '0px', top: '0px', visibility: 'hidden' });

    function show(value: boolean) {
        if (!value || !element.current || !tooltip.current) return setPosition({ ...position, visibility: 'hidden' });

        let { left: l, top: t, right, bottom, width, height } = element.current.getBoundingClientRect();
        const r = window.innerWidth - right;
        const b = window.innerHeight - bottom;

        const max = Math.max(l, t, r, b);
        const { width: w, height: h } = tooltip.current.getBoundingClientRect();
        let left = l + (width - w) / 2 + 'px', top = t + (height - h) / 2 + 'px';

        switch (max) {
            case l:
                left = `calc(${l - w}px - var(--f-spacing-sml))`;
                break;
            case t:
                top = `calc(${t - h}px - var(--f-spacing-sml))`;
                break;
            case r:
                left = `calc(${right}px + var(--f-spacing-sml))`;
                break;
            case b:
                top = `calc(${bottom}px + var(--f-spacing-sml))`;
        }

        setPosition({ left, top, visibility: 'visible' });
    }

    return <>
        {cloneElement(children, {
            ref: combineRefs(element, (children as any).ref),
            onMouseEnter: (e: React.MouseEvent) => {
                children.props.onMouseEnter?.(e);
                show(true);
            },
            onMouseLeave: (e: React.MouseEvent) => {
                children.props.onMouseLeave?.(e);
                show(false);
            }
        })}

        <div ref={combineRefs(ref, tooltip)} {...props} className={classes(style.tooltip, props.className)} style={position} data-visible={position.visibility === 'visible'}>
            {content}
        </div>
    </>;
});


Tooltip.displayName = 'Tooltip';

export default Tooltip;