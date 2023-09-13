import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, FluidStyles, Selectors } from "../../../src/types";
import { forwardRef } from "react";
import { createStyles } from "../../core/style";

export type FrameStyles = FluidStyles<'.frame' | '.frame__shadow' | '.frame__border' | '.frame__bg__light' | '.frame__bg__dark'>;

const Frame = forwardRef(({ children, cc = {}, radius = 'sml', shadow, border, background = 'none', ...props }:
    {
        cc?: Selectors<'frame' | 'frame__shadow' | 'frame__border' | 'frame__bg__light' | 'frame__bg__dark'>;
        radius?: FluidSize;
        shadow?: boolean;
        border?: boolean;
        background?: 'none' | 'dark' | 'light';
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('frame', {
        '.frame': {
            overflow: 'hidden',
            color: 'var(--f-clr-text-100)'
        },

        '.frame__shadow': {
            boxShadow: '0 0 8px rgb(0, 0, 0, 0.08)'
        },

        '.frame__border': {
            border: 'solid 1px var(--f-clr-fg-200)'
        },

        '.frame__bg__light': {
            background: 'var(--f-clr-fg-100)'
        },

        '.frame__bg__dark': {
            background: 'var(--f-clr-bg-100)'
        },

        '.frame img': {
            objectFit: 'cover',
            display: 'block'
        }
    });
    const style = combineClasses(styles, cc);

    return <div ref={ref} {...props}
        className={classes(
            style.frame,
            shadow && style.frame__shadow,
            border && style.frame__border,
            style[`frame__bg__${background}`],
            props.className
        )}
        style={{
            borderRadius: `var(--f-radius-${radius})`,
            ...props.style
        }}>
        {children}
    </div>;
});

Frame.displayName = 'Frame';

export default Frame;