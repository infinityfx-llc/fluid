'use client';

import { Selectors } from "../../../../src/types";
import { createStyles } from "../../../core/style";
import { classes, combineClasses } from "../../../core/utils";

const styles = createStyles('modal-footer', fluid => ({
    '.footer': {
        position: 'relative',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--f-spacing-sml)',
        background: 'var(--f-clr-bg-100)',
        borderTop: 'solid 1px var(--f-clr-surface-200)',
        padding: 'var(--f-spacing-med)',
        borderBottomLeftRadius: 'calc(var(--f-radius-lrg) - 1px)',
        borderBottomRightRadius: 'calc(var(--f-radius-lrg) - 1px)',
    },

    [`@media (max-width: ${fluid.breakpoints.mob}px)`]: {
        '.footer': {
            background: 'none'
        }
    }
}));

export type ModalFooterSelectors = Selectors<'footer'>;

export default function Footer({ children, cc = {}, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: ModalFooterSelectors;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <div {...props} className={classes(style.footer, props.className)}>
        {children}
    </div>;
}

Footer.displayName = 'ModalFooter';