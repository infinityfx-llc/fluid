import { Selectors } from "../../../../src/types";
import { classes } from "../../../../src/utils";
import { createStyles } from "../../../core/style";
import { combineClasses } from "../../../core/utils";

const styles = createStyles('box-backdrop', {
    '.backdrop': {
        position: 'absolute',
        inset: 0,
        zIndex: -1
    },

    '.backdrop img': {
        display: 'block',
        objectFit: 'cover'
    },

    '.fade': {
        position: 'absolute',
        inset: 0,
        opacity: .25,
        zIndex: 2
    },

    '.fade.top': {
        background: 'linear-gradient(black, transparent 50%)'
    },

    '.fade.bottom': {
        background: 'linear-gradient(transparent 50%, black)'
    },

    '.blur': {
        position: 'absolute',
        inset: 0,
        zIndex: 1
    },

    '.blur:nth-child(1)': {
        backdropFilter: 'blur(2px)',
        ['--blur-offset' as any]: '50%'
    },

    '.blur:nth-child(2)': {
        backdropFilter: 'blur(4px)',
        ['--blur-offset' as any]: '37.5%'
    },

    '.blur:nth-child(3)': {
        backdropFilter: 'blur(8px)',
        ['--blur-offset' as any]: '25%'
    },

    '.blur:nth-child(4)': {
        backdropFilter: 'blur(16px)',
        ['--blur-offset' as any]: '12.5%'
    },

    '.blur.top': {
        maskImage: 'linear-gradient(black calc(var(--blur-offset) - 25%), transparent var(--blur-offset))',
    },

    '.blur.bottom': {
        maskImage: 'linear-gradient(transparent calc(100% - var(--blur-offset)), black calc(100% - var(--blur-offset) + 25%))',
    }
});

export type BoxBackdropSelectors = Selectors<'backdrop' | 'fade' | 'blur' | 'top' | 'bottom'>;

export default function Backdrop({ children, cc = {}, fade, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: BoxBackdropSelectors;
        fade?: 'bottom' | 'top';
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <div
        {...props}
        className={classes(
            style.backdrop,
            fade && style[`f__${fade}`],
            props.className
        )}>
        {fade && <div className={classes(style.blur, style[fade])} />}
        {fade && <div className={classes(style.blur, style[fade])} />}
        {fade && <div className={classes(style.blur, style[fade])} />}
        {fade && <div className={classes(style.blur, style[fade])} />}
        {fade && <div className={classes(style.fade, style[fade])} />}

        {children}
    </div>;
}

Backdrop.displayName = 'BoxBackdrop';