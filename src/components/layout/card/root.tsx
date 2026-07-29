import { FluidSize } from "../../../../src/types";
import { classes } from "../../../../src/utils";
import { createGlobalStyles } from "../../../core/style";

createGlobalStyles({
    '.card': {
        isolation: 'isolate'
    },

    '.card > img': {
        display: 'block',
        objectFit: 'cover'
    },

    '.card.back': {
        background: 'var(--f-clr-bg-100)'
    },

    '.card.front': {
        background: 'var(--f-clr-surface-100)'
    },

    '.card.top': {
        background: 'var(--f-clr-surface-200)'
    },

    '.card:not(.borderless)': {
        border: 'solid 1px var(--f-clr-surface-300)'
    },

    '.card.border': {
        border: 'solid 1px var(--f-clr-surface-300)'
    },

    '.pd-xxs': {
        padding: 'var(--f-spacing-xxs)'
    },

    '.pd-xsm': {
        padding: 'var(--f-spacing-xsm)'
    },

    '.pd-sml': {
        padding: 'var(--f-spacing-sml)'
    },

    '.pd-med': {
        padding: 'var(--f-spacing-med)'
    },

    '.pd-lrg': {
        padding: 'var(--f-spacing-lrg)'
    },

    '.pd-xlg': {
        padding: 'var(--f-spacing-xlg)'
    },

    '.gp-xsm': {
        gap: 'var(--f-spacing-xsm)'
    },

    '.gp-sml': {
        gap: 'var(--f-spacing-sml)'
    },

    '.gp-med': {
        gap: 'var(--f-spacing-med)'
    },

    '.gp-lrg': {
        gap: 'var(--f-spacing-lrg)'
    },

    '.rd-xsm': {
        borderRadius: 'var(--f-radius-xsm)'
    },

    '.rd-sml': {
        borderRadius: 'var(--f-radius-sml)'
    },

    '.rd-med': {
        borderRadius: 'var(--f-radius-med)'
    },

    '.rd-lrg': {
        borderRadius: 'var(--f-radius-lrg)'
    },

    '.sd-sml': {
        boxShadow: 'var(--f-shadow-sml)'
    },

    '.sd-med': {
        boxShadow: 'var(--f-shadow-med)'
    },

    '.sd-lrg': {
        boxShadow: 'var(--f-shadow-lrg)'
    }
});

/**
 * A versatile composable container component.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/card}
 */
export default function Root({ children, elevated, borderless, radius = 'med', color = 'front', pad = 'med', ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        /**
         * Shows a backdrop shadow.
         * 
         * @default false
         */
        elevated?: boolean;
        /**
         * @default false
         */
        borderless?: boolean;
        /**
         * @default 'med'
         */
        radius?: FluidSize;
        /**
         * @default 'front'
         */
        color?: 'back' | 'front' | 'top';
        /**
         * @default 'med'
         */
        pad?: 'none' | 'xxs' | FluidSize | 'xlg';
    } & React.HTMLAttributes<HTMLDivElement>) {

    return <div
        {...props}
        data-fb={!borderless ? 'true' : undefined}
        className={classes(
            'card',
            color,
            borderless && 'borderless',
            elevated && `sd-med`,
            pad !== 'none' && `pd-${pad}`,
            `rd-${radius}`,
            props.className
        )}>
        {children}
    </div>;
}

Root.displayName = 'Card';