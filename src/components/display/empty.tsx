import { classes, combineClasses } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { createStyles } from "../../core/style";
import { Icon } from "../../core/icons";

const styles = createStyles('empty', {
    '.empty': {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--f-spacing-med)',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1
    },

    '.header': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--f-spacing-xsm)'
    },

    '.title': {
        fontWeight: 600,
        textAlign: 'center'
    },

    '.message': {
        textAlign: 'center',
        color: 'var(--f-clr-grey-600)',
        maxWidth: 'min(16rem, 75vw)'
    },

    '.icon': {
        display: 'flex',
        padding: '.6em',
        backgroundColor: 'var(--f-clr-surface-200)',
        borderRadius: 'var(--f-radius-med)'
    },

    '.content': {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--f-spacing-sml)'
    }
});

export type EmptySelectors = Selectors<'empty' | 'header' | 'title' | 'message' | 'icon' | 'content'>;

/**
 * Displays an empty state.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/empty}
 */
export default function Empty({ children, cc = {}, title, message, icon = <Icon type="alert" />, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: EmptySelectors;
        title: string;
        message?: string;
        icon?: React.ReactNode;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <div
        {...props}
        className={classes(
            style.empty,
            props.className
        )}>
        <div className={style.header}>
            <div className={style.icon}>
                {icon}
            </div>
            <div className={style.title}>
                {title}
            </div>
            {message && <p className={style.message}>
                {message}
            </p>}
        </div>

        <div className={style.content}>
            {children}
        </div>
    </div>;
}