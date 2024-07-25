import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, Selectors } from "../../../src/types";
import { createStyles } from "../../core/style";

const styles = createStyles('frame', {
    '.frame': {
        overflow: 'hidden'
    },

    '.shadow': {
        boxShadow: 'var(--f-shadow-med)'
    },

    '.border': {
        border: 'solid 1px var(--f-clr-fg-200)'
    },

    '.bg__light': {
        background: 'var(--f-clr-fg-100)'
    },

    '.bg__dark': {
        background: 'var(--f-clr-bg-100)'
    },

    '.frame img': {
        objectFit: 'cover',
        display: 'block'
    }
});

export type FrameSelectors = Selectors<'frame' | 'shadow' | 'border' | 'bg__light' | 'bg__dark'>;

/**
 * A styled container.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/frame}
 */
export default function Frame({ children, cc = {}, radius = 'sml', shadow, border, background = 'none', ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: FrameSelectors;
        radius?: FluidSize;
        shadow?: boolean;
        border?: boolean;
        background?: 'none' | 'dark' | 'light';
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <div {...props}
        className={classes(
            style.frame,
            shadow && style.shadow,
            border && style.border,
            style[`bg__${background}`],
            props.className
        )}
        style={{
            borderRadius: `var(--f-radius-${radius})`,
            ...props.style
        }}>
        {children}
    </div>;
}