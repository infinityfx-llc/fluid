import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, Selectors } from "../../../src/types";
import { createStyles } from "../../core/style";
import { Icon } from "../../core/icons";

const styles = createStyles('badge', {
    '.badge': {
        fontWeight: 700,
        borderRadius: 'var(--f-radius-sml)',
        padding: '.3em .6em',
        transition: 'background-color .15s',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xxs)',
        lineHeight: 1.2
    },

    '.v__default': {
        backgroundColor: 'var(--f-clr-primary-300)',
        color: 'var(--f-clr-text-100)'
    },

    '.v__default:hover': {
        backgroundColor: 'var(--f-clr-primary-400)'
    },

    '.v__light': {
        backgroundColor: 'var(--f-clr-bg-200)',
        color: 'var(--f-clr-primary-100)'
    },

    '.v__light:hover': {
        backgroundColor: 'var(--f-clr-primary-600)'
    },

    '.v__neutral': {
        backgroundColor: 'var(--f-clr-bg-200)',
        border: 'solid 1px var(--f-clr-fg-200)',
        color: 'var(--f-clr-text-100)'
    },

    '.v__neutral:hover': {
        backgroundColor: 'var(--f-clr-fg-100)'
    },

    '.s__xsm': {
        fontSize: '.6rem'
    },

    '.s__sml': {
        fontSize: 'var(--f-font-size-xxs)',
    },

    '.s__med': {
        fontSize: 'var(--f-font-size-xsm)',
    },

    '.s__lrg': {
        fontSize: 'var(--f-font-size-sml)',
    },

    '.badge.round': {
        borderRadius: '999px'
    },

    '.close': {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer'
    }
});

export type BadgeSelectors = Selectors<'badge' | 'v__default' | 'v__light' | 'v__neutral' | 'round' | 's__xsm' | 's__sml' | 's__med' | 's__lrg'>;

/**
 * A badge used for displaying attributes or small information snippets.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/badge}
 */
export default function Badge({ children, cc = {}, variant = 'default', round = false, size = 'sml', color, onClose, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: BadgeSelectors;
        variant?: 'default' | 'light' | 'neutral';
        round?: boolean;
        size?: FluidSize;
        onClose?: () => void;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <div {...props}
        className={classes(
            style.badge,
            style[`v__${variant}`],
            style[`s__${size}`],
            round && style.round,
            props.className
        )}
        style={{
            backgroundColor: variant === 'default' ? color : undefined,
            color: variant === 'light' ? color : undefined,
            ...props.style
        }}>
        {children}

        {onClose ? <div className={styles.close} onClick={onClose}>
            <Icon type="close" />
        </div> : null}
    </div>;
}