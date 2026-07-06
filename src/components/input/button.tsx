import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, Selectors } from "../../../src/types";
import Spinner from "../feedback/spinner";
import { createStyles } from "../../core/style";
import Interactable from "../feedback/interactable";
import { Children, isValidElement, useMemo } from "react";

const styles = createStyles('button', {
    '.button': {
        ['--block-padding' as any]: '.8em',
        ['--inline-padding' as any]: '1em',
        position: 'relative',
        borderRadius: 'var(--f-radius-sml)',
        padding: 'var(--block-padding) var(--inline-padding)',
        backgroundColor: 'var(--color, var(--f-clr-primary-100))',
        color: 'var(--f-clr-text-100)',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    '.button.compact': {
        ['--block-padding' as any]: '.6em',
        ['--inline-padding' as any]: '.8em',
    },

    '.button:not(.start__text):has(svg:first-child)': {
        paddingLeft: 'var(--block-padding)'
    },

    '.button:not(.end__text):has(svg:last-child)': {
        paddingRight: 'var(--block-padding)'
    },

    '.button.round': {
        borderRadius: 'calc(1.4em + 1px)'
    },

    '.s__xsm': {
        fontSize: 'var(--f-font-size-xxs)'
    },

    '.s__sml': {
        fontSize: 'var(--f-font-size-xsm)'
    },

    '.s__med': {
        fontSize: 'var(--f-font-size-sml)'
    },

    '.s__lrg': {
        fontSize: 'var(--f-font-size-med)'
    },

    '.v__default': {
        color: 'var(--f-clr-text-200)'
    },

    '.v__light': {
        backgroundColor: 'var(--f-clr-surface-200)',
        color: 'var(--color, var(--f-clr-primary-100))'
    },

    '.v__neutral': {
        backgroundColor: 'var(--f-clr-surface-100)',
        border: 'solid 1px var(--f-clr-surface-300)'
    },

    '.v__neutral .highlight': {
        borderRadius: 'calc(var(--f-radius-sml) - 1px)'
    },

    '.button[data-loading="false"]:disabled': {
        color: 'var(--f-clr-grey-400)',
        backgroundColor: 'var(--f-clr-grey-100)'
    },

    '.v__minimal': {
        backgroundColor: 'transparent',
        color: 'var(--color, var(--f-clr-text-100))'
    },

    '.button:enabled:hover': {
        cursor: 'pointer'
    },

    '.content': {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xsm)',
        lineHeight: 1
    },

    '.button:enabled:active .content': {
        translate: '0px 1px'
    },

    '.button[data-loading="true"] .content': {
        opacity: 0
    },

    '.loader': {
        position: 'absolute'
    }
});

export type ButtonSelectors = Selectors<'button' | 'content' | 'loader' | 'round' | 'compact' | 's__xsm' | 's__sml' | 's__med' | 's__lrg' | 'v__default' | 'v__neutral' | 'v__light' | 'v__minimal'>;

/**
 * A button.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/button}
 */
export default function Button({ children, cc = {}, round = false, compact = false, size = 'med', variant = 'default', color, loading = false, ...props }:
    {
        ref?: React.Ref<HTMLButtonElement>;
        cc?: ButtonSelectors;
        round?: boolean;
        compact?: boolean;
        size?: FluidSize;
        variant?: 'default' | 'neutral' | 'light' | 'minimal';
        color?: string;
        loading?: boolean;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const style = combineClasses(styles, cc);

    const [start, end] = useMemo(() => {
        let array = Children.toArray(children),
            start = false,
            end = false;

        array.forEach((child, i) => {
            if (!isValidElement(child)) {
                if (i === 0) start = true;
                if (i === array.length - 1) end = true;
            }
        });
        
        return [start, end];
    }, [children]);


    return <Interactable
        {...props}
        highlightColor={variant === 'default' ? 'var(--f-clr-highlight-100)' : undefined}
        disabled={props.disabled || loading}
        cc={{
            ...cc,
            highlight: style.highlight
        }}
        className={classes(
            style.button,
            round && style.round,
            compact && style.compact,
            start && style.start__text,
            end && style.end__text,
            style[`s__${size}`],
            style[`v__${variant}`],
            props.className
        )}
        style={{
            '--color': color,
            ...props.style
        } as any}
        data-loading={loading}
        data-fb={variant === 'neutral' ? 'true' : undefined}>
        <span className={style.content}>{children}</span>

        {loading && <Spinner className={style.loader} />}
    </Interactable>;
}