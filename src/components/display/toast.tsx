import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { forwardRef } from "react";
import Button from "../input/button";
import { MdClose } from "react-icons/md";
import { classes } from "@/src/core/utils";

const Toast = forwardRef(({ styles = {}, icon, color, title, text, round, onClose, ...props }:
    {
        styles?: FluidStyles;
        icon: React.ReactNode;
        color: string;
        title: string;
        text?: string;
        round?: boolean;
        onClose?: () => void;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.toast': {
            padding: '.4em',
            backgroundColor: 'var(--f-clr-fg-100)',
            borderRadius: 'var(--f-radius-sml)',
            border: 'solid 1px var(--f-clr-fg-200)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-med)',
            minWidth: 'clamp(0px, 16rem, 100%)'
        },

        '.toast[data-round="true"]': {
            borderRadius: '999px'
        },

        '.icon': {
            position: 'relative',
            padding: '.4em',
            display: 'flex',
            fontSize: '1.2em',
            color: 'white',
            zIndex: 1
        },

        '.toast[data-hastext="true"] .icon': {
            marginLeft: '.3em'
        },

        '.background': {
            position: 'absolute',
            inset: 0,
            borderRadius: 'var(--f-radius-sml)',
            opacity: 0.6,
            zIndex: -1
        },

        '.toast[data-round="true"] .background': {
            borderRadius: '999px'
        },

        '.content': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xxs)',
            overflow: 'hidden'
        },

        '.title': {
            fontWeight: 700,
            fontSize: '.9em',
            color: 'var(--f-clr-text-100)'
        },

        '.text': {
            color: 'var(--f-clr-grey-700)',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        },

        '.button': {
            marginLeft: 'auto'
        },

        '.toast[data-hastext="true"] .button': {
            marginRight: '.3em'
        }
    });

    return <div ref={ref} {...props} className={classes(style.toast, props.className)} data-round={round} data-hastext={!!text}>
        <div className={style.icon}>
            <div className={style.background} style={{ backgroundColor: color }} />

            {icon}
        </div>

        <div className={style.content}>
            <div className={style.title}>{title}</div>

            {text && <div className={style.text}>{text}</div>}
        </div>

        <Button variant="minimal" className={style.button} round={round} onClick={onClose}>
            <MdClose />
        </Button>
    </div>;
});

Toast.displayName = 'Toast';

export default Toast;