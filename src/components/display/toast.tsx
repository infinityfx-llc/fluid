import { FluidStyles, Selectors } from "../../../src/types";
import { forwardRef } from "react";
import Button from "../input/button";
import { MdClose } from "react-icons/md";
import { classes, combineClasses } from "../../../src/core/utils";
import { createStyles } from "../../core/style";

export type ToastStyles = FluidStyles<'.toast' | '.icon' | '.background' | '.content' | '.text'>;

const Toast = forwardRef(({ children, cc = {}, icon, color, title, round, closeable = true, onClose, ...props }:
    {
        cc?: Selectors<'toast' | 'icon' | 'background' | 'content' | 'text'>;
        icon: React.ReactNode;
        color: string;
        title: string;
        closeable?: boolean;
        round?: boolean;
        onClose?: () => void;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('toast', {
        '.toast': {
            padding: '.4em',
            backgroundColor: 'var(--f-clr-fg-100)',
            borderRadius: 'var(--f-radius-med)',
            border: 'solid 1px var(--f-clr-fg-200)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--f-spacing-med)',
            minWidth: 'clamp(0px, 16rem, 100%)'
        },

        '.toast__round': {
            borderRadius: 'calc(1.4em + 1px)'
        },

        '.icon': {
            position: 'relative',
            padding: '.4em',
            display: 'flex',
            fontSize: '1.2em',
            lineHeight: 1,
            color: 'white',
            zIndex: 1
        },

        '.background': {
            position: 'absolute',
            inset: 0,
            borderRadius: 'var(--f-radius-sml)',
            opacity: 0.6,
            zIndex: -1
        },

        '.toast__round .background': {
            borderRadius: '999px'
        },

        '.content': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xxs)',
            color: 'var(--f-clr-grey-700)',
            alignSelf: 'center',
            flexGrow: 1
        },

        '.title': {
            fontWeight: 700,
            fontSize: '.9em',
            color: 'var(--f-clr-text-100)'
        }
    });
    const style = combineClasses(styles, cc);

    return <div ref={ref} {...props}
        className={classes(
            style.toast,
            round && style.toast__round,
            props.className
        )}>
        <div className={style.icon}>
            <div className={style.background} style={{ backgroundColor: color }} />

            {icon}
        </div>

        <div className={style.content}>
            <div className={style.title}>{title}</div>

            {children}
        </div>

        {closeable && <Button compact variant="minimal" round={round} onClick={onClose}>
            <MdClose />
        </Button>}
    </div>;
});

Toast.displayName = 'Toast';

export default Toast;